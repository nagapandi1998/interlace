import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loader } from '../../shared/components/loader/loader';

import { SuperDoc } from '@harbour-enterprises/superdoc';
// import '@harbour-enterprises/superdoc/style.css';


@Component({
  selector: 'app-text-editor',
  standalone: true,
 imports: [CommonModule,  MatIconModule, MatSnackBarModule, Loader],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss',
})
export class TextEditor {
  
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
      document: file || undefined,
      documentMode: 'editing',
      pagination: true,
      rulers: true,
      onReady: () => console.log('SuperDoc ready'),
      onEditorCreate: () => console.log('Editor created'),
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
        this.initEditor(file);
        this.loading = false;

        this.snackBar.open(`"${file.name}" loaded successfully!`, '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      }, 200);
    }
  }

async exportDocx(): Promise<void> {
  if (!this.editor) {
    this.snackBar.open('Editor not initialized', '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
    return;
  }

  this.loading = true;

  try {
    // Try multiple known export entry points and normalize result to a Blob
    let result: any = null;

    if (typeof this.editor.exportDocx === 'function') {
      result = await this.editor.exportDocx();
    } else if (typeof this.editor.export === 'function') {
      // some APIs use export(format) signature
      result = await this.editor.export('docx');
    } else if (this.editor.export && typeof this.editor.export.docx === 'function') {
      result = await this.editor.export.docx();
    } else if (typeof (this.editor as any).toDocx === 'function') {
      result = await (this.editor as any).toDocx();
    } else {
      this.snackBar.open('Export to DOCX is not supported by this editor instance.', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      this.loading = false;
      return;
    }

    // Normalize to Blob
    let blob: Blob;
    if (result instanceof Blob) {
      blob = result;
    } else if (result instanceof ArrayBuffer) {
      blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    } else if (result && (result.buffer instanceof ArrayBuffer || ArrayBuffer.isView(result))) {
      // Uint8Array or similar
      const arr = result.buffer ? new Uint8Array(result.buffer) : new Uint8Array(result);
      blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    } else {
      // Fallback: attempt to create blob from result (string/base64)
      try {
        if (typeof result === 'string') {
          // assume base64 or plain text - try base64 decode first
          const base64 = result.includes('base64,') ? result.split('base64,')[1] : result;
          const byteChars = atob(base64);
          const byteNumbers = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        } else {
          throw new Error('Unsupported export result type');
        }
      } catch (e) {
        console.error('Unable to normalize export result to Blob', e, result);
        this.snackBar.open('Export produced an unsupported result type.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
        this.loading = false;
        return;
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported-${Date.now()}.docx`;
    a.click();

    this.snackBar.open('Document exported successfully!', '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  } catch (err: any) {
    console.error(err);
    this.snackBar.open(`Export error: ${err?.message ?? 'Unknown error'}`, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  } finally {
    this.loading = false;
  }
}




}