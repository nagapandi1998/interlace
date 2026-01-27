import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { SuperDoc } from '@harbour-enterprises/superdoc';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../shared/service/toaster/toast-service';
import { Loader } from '../../shared/components/loader/loader';
import Typo from 'typo-js';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, Loader],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss',
})
export class TextEditor implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  editor: any = null;
  loading = false;
  typo: any;
  spellPopup = {
    visible: false,
    x: 0,
    y: 0,
    from: 0,
    to: 0,
    suggestions: [] as string[],
  };

  constructor(
    private zone: NgZone,
    private toastService: ToastService,
  ) {}

  private createEditor(file?: File | string) {
    this.editor?.destroy?.();

    this.editor = new SuperDoc({
      selector: '#superdoc',
      toolbar: '#superdoc-toolbar',
      document: file ?? '',
      documentMode: 'editing',
      pagination: true,
      rulers: true,
      shouldNotGroupWhenFull: true,
      // defaultFontFamily: 'sans-serif',
      defaultFontSize: 12,

      modules: {
        toolbar: {
          fonts: [
            { label: 'Arial', key: 'Arial, sans-serif' },
            { label: 'Times New Roman', key: 'Times New Roman, serif' },
            // { label: 'Georgia', key: 'Georgia, serif' },
            // { label: 'Verdana', key: 'Verdana, sans-serif' },
            // { label: 'Courier New', key: 'Courier New, monospace' },
            { label: 'Roboto', key: 'Roboto, sans-serif' },
            { label: 'Sans Serif', key: 'sans-serif' },
            { label: 'Noto Sans Tamil', key: 'Noto Sans Tamil' },
            { label: 'Azhagi', key: 'Azhagi' },
          ],
        },
      },

      onReady: () => {
        console.log('Editor ready');
        this.setupSpellChecker();
      },
      onEditorCreate: () => console.log('Editor created'),
    } as any);
  }

  ngAfterViewInit() {
    // Load dictionary files (you might want to fetch them or bundle)
    fetch('/assets/dictionaries/en_US.aff')
      .then((r) => r.text())
      .then((affData) => {
        fetch('/assets/dictionaries/en_US.dic')
          .then((r) => r.text())
          .then((dicData) => {
            this.typo = new Typo('en_US', affData, dicData, {});
            console.log('Typo.js initialized');
          });
      });

    this.zone.runOutsideAngular(() => {
      this.createEditor();
    });
  }

  openFile() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.loading = true;

      setTimeout(() => {
        this.createEditor(file);
        this.loading = false;

        this.toastService.showMsg('success', `"${file.name}" imported successfully!`);

        // Allow re-import of the same file
        this.fileInput.nativeElement.value = '';
      }, 200);
    }
  }

  clearEditor() {
    this.createEditor();
    this.fileInput.nativeElement.value = '';
    this.toastService.showMsg('success', 'Editor has been cleared.');
  }

  private getEditorText(): string {
    if (!this.editor || !this.editor.activeEditor) return '';
    // ProseMirror doc
    const doc = this.editor.activeEditor.view.state.doc;
    // Convert to plain text
    const text = doc.textContent?.trim() || '';
    return text;
  }

  async exportDocx(): Promise<void> {
    if (!this.editor) {
      this.toastService.showMsg('error', 'Editor is not initialized.');
      return;
    }

    this.loading = true;

    try {
      const text = this.getEditorText();

      if (!text) {
        this.toastService.showMsg('error', 'No text found in the editor.');
        return;
      }

      // rename & method
      await this.editor.export({
        exportType: ['docx'],
        exportedName: 'DVAC Doc.docx',
      });

      this.toastService.showMsg('success', 'File exported successfully!');
    } catch (err: any) {
      this.toastService.showMsg('error', err?.message);
      console.error('Export error:', err);
    } finally {
      setTimeout(() => (this.loading = false), 200);
    }
  }

  checkWord(word: string) {
    if (!this.typo) return false;
    return this.typo.check(word);
  }

  getSuggestions(word: string): string[] {
    if (!this.typo) return [];
    return this.typo.suggest(word, 5); // top 5 suggestions
  }

  private setupSpellChecker() {
    const view = this.editor.activeEditor.view;

    view.dom.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();

      const pos = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });
      if (!pos) return;

      const { state } = view;
      const $pos = state.doc.resolve(pos.pos);
      const text = $pos.parent.textContent || '';
      const offset = $pos.parentOffset;

      const word = this.getWordAt(text, offset);
      if (!word || this.checkWord(word)) {
        this.zone.run(() => (this.spellPopup.visible = false));
        return;
      }

      const suggestions = this.getSuggestions(word);
      if (!suggestions.length) return;

      const start = text.lastIndexOf(word, offset);
      const from = pos.pos - (offset - start);
      const to = from + word.length;

      this.zone.run(() => {
        this.spellPopup = {
          visible: true,
          x: event.clientX,
          y: event.clientY,
          from,
          to,
          suggestions,
        };
      });
    });

    document.addEventListener('click', () => {
      this.zone.run(() => {
        this.spellPopup.visible = false;
      });
    });
  }

  replaceMisspelledWord(word: string) {
    const view = this.editor.activeEditor.view;
    const { state, dispatch } = view;

    dispatch(state.tr.insertText(word, this.spellPopup.from, this.spellPopup.to));
    this.spellPopup.visible = false;
  }

  private getWordAt(text: string, offset: number): string {
    const left = text.slice(0, offset).search(/\S+$/);
    const right = text.slice(offset).search(/\s/);

    if (left === -1) return '';

    const start = left;
    const end = right === -1 ? text.length : offset + right;

    return text.slice(start, end);
  }

  // async exportDocx(): Promise<void> {
  //   if (!this.editor) {
  //     this.snackBar.open('Editor not initialized', '', {
  //       duration: 3000,
  //       verticalPosition: 'top',
  //       panelClass: ['error-snackbar'],
  //     });
  //     return;
  //   }

  //   this.loading = true;

  //   try {
  //     // Try multiple known export entry points and normalize result to a Blob
  //     let result: any = null;

  //     if (typeof this.editor.exportDocx === 'function') {
  //       result = await this.editor.exportDocx();
  //     } else if (typeof this.editor.export === 'function') {
  //       // some APIs use export(format) signature
  //       result = await this.editor.export('docx');
  //     } else if (this.editor.export && typeof this.editor.export.docx === 'function') {
  //       result = await this.editor.export.docx();
  //     } else if (typeof (this.editor as any).toDocx === 'function') {
  //       result = await (this.editor as any).toDocx();
  //     } else {
  //       this.snackBar.open('Export to DOCX is not supported by this editor instance.', '', {
  //         duration: 5000,
  //         verticalPosition: 'top',
  //         panelClass: ['error-snackbar'],
  //       });
  //       this.loading = false;
  //       return;
  //     }

  //     // Normalize to Blob
  //     let blob: Blob;
  //     if (result instanceof Blob) {
  //       blob = result;
  //     } else if (result instanceof ArrayBuffer) {
  //       blob = new Blob([result], {
  //         type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       });
  //     } else if (result && (result.buffer instanceof ArrayBuffer || ArrayBuffer.isView(result))) {
  //       // Uint8Array or similar
  //       const arr = result.buffer ? new Uint8Array(result.buffer) : new Uint8Array(result);
  //       blob = new Blob([arr], {
  //         type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       });
  //     } else {
  //       // Fallback: attempt to create blob from result (string/base64)
  //       try {
  //         if (typeof result === 'string') {
  //           // assume base64 or plain text - try base64 decode first
  //           const base64 = result.includes('base64,') ? result.split('base64,')[1] : result;
  //           const byteChars = atob(base64);
  //           const byteNumbers = new Array(byteChars.length);
  //           for (let i = 0; i < byteChars.length; i++) {
  //             byteNumbers[i] = byteChars.charCodeAt(i);
  //           }
  //           const byteArray = new Uint8Array(byteNumbers);
  //           blob = new Blob([byteArray], {
  //             type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //           });
  //         } else {
  //           throw new Error('Unsupported export result type');
  //         }
  //       } catch (e) {
  //         console.error('Unable to normalize export result to Blob', e, result);
  //         this.snackBar.open('Export produced an unsupported result type.', '', {
  //           duration: 5000,
  //           verticalPosition: 'top',
  //           panelClass: ['error-snackbar'],
  //         });
  //         this.loading = false;
  //         return;
  //       }
  //     }

  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `exported.docx`;
  //     a.click();

  //     this.snackBar.open('Document exported successfully!', '', {
  //       duration: 3000,
  //       verticalPosition: 'top',
  //       panelClass: ['success-snackbar'],
  //     });
  //   } catch (err: any) {
  //     console.error(err);
  //     this.snackBar.open(`Export error: ${err?.message ?? 'Unknown error'}`, '', {
  //       duration: 5000,
  //       verticalPosition: 'top',
  //       panelClass: ['error-snackbar'],
  //     });
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  // async exportDocx(): Promise<Blob | null> {
  //   if (!this.editor) {
  //     this.showError('Editor is not initialized.');
  //     return null;
  //   }

  //   this.loading = true;

  //   try {
  //     const text = this.getEditorText();

  //     if (!text) {
  //       this.showError('No text found in the editor.');
  //       return null;
  //     }

  //     //SuperDoc automatic Export as DOCX
  //     const result =
  //       (await this.editor.export?.('docx')) ||
  //       (await this.editor.exportDocx?.()) ||
  //       (await this.editor.export?.docx?.());

  //     // Capture the file data as a Blob
  //     const blob =
  //       result instanceof Blob
  //         ? result
  //         : new Blob([result], {
  //             type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //           });

  //     this.showSuccess('File exported successfully!');

  //     return blob;
  //   } catch (err: any) {
  //     this.showError(err?.message);
  //     console.log('Export error:', err);
  //     return null;
  //   } finally {
  //     setTimeout(() => {
  //       this.loading = false;
  //     }, 200);
  //   }
  // }
}
