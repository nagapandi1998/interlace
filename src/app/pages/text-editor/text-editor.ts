import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperDoc } from '@harbour-enterprises/superdoc';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loader } from '../../shared/components/loader/loader';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule, Loader],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss',
})
export class TextEditor implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  editor: any = null;
  loading = false;

  constructor(private snackBar: MatSnackBar) {}

  ngAfterViewInit() {
    this.initEditor();
  }

  // Initialize SuperDoc editor
  initEditor(file: File | null = null) {
    if (this.editor) {
      this.editor = null;
    }

    this.editor = new SuperDoc({
      selector: '#superdoc',
      toolbar: '#superdoc-toolbar',
      document: file,
      documentMode: 'editing',
      pagination: true,
      rulers: true,
      shouldNotGroupWhenFull: true,
      onReady: () => console.log('Editor ready'),
      onEditorCreate: () => console.log('Editor created'),
    } as any);
  }

  openFile() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.loading = true;

      setTimeout(() => {
        this.initEditor(file);
        this.loading = false;

        this.snackBar.open(`"${file.name}" imported successfully!`, '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      }, 200);
    }
  }

  clearEditor() {
    if (!this.editor || !this.editor.activeEditor) return;

    const view = this.editor.activeEditor.view;

    // Create a new empty document using ProseMirror schema
    const { schema } = this.editor.activeEditor;
    const emptyDoc = schema.topNodeType.createAndFill();

    // Replace the current document with the empty document
    view.dispatch(view.state.tr.replaceWith(0, view.state.doc.content.size, emptyDoc!.content));

    // Optional: reset scroll to top
    view.scrollDOM.scrollTop = 0;

    this.snackBar.open('Editor cleared!', '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
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

  private getEditorText(): string {
    if (!this.editor || !this.editor.activeEditor) return '';

    // ProseMirror doc
    const doc = this.editor.activeEditor.view.state.doc;

    // Convert to plain text
    const text = doc.textContent?.trim() || '';
    return text;
  }

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

  async exportDocx(): Promise<void> {
    if (!this.editor) {
      this.showError('Editor is not initialized.');
      return;
    }

    this.loading = true;

    try {
      const text = this.getEditorText();

      if (!text) {
        this.showError('No text found in the editor.');
        return;
      }

      // rename & method
      await this.editor.export({
        exportType: ['docx'],
        exportedName: 'DVAC Doc.docx',
      });

      this.showSuccess('File exported successfully!');
    } catch (err: any) {
      this.showError(err?.message);
      console.error('Export error:', err);
    } finally {
      setTimeout(() => (this.loading = false), 200);
    }
  }

  private showSuccess(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
