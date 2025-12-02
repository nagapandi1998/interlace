import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EditorModule, TINYMCE_SCRIPT_SRC, EditorComponent } from '@tinymce/tinymce-angular';
import * as mammoth from 'mammoth';

// import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, ExternalHyperlink, Table, TableCell, TableRow, convertInchesToTwip, WidthType, ShadingType, BorderStyle, ParagraphChild, IImageOptions, AlignmentType, Spacing, IParagraphOptions, TabStopPosition, TabStopType } from "docx";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, ExternalHyperlink, Table, TableCell, TableRow, convertInchesToTwip, WidthType, ShadingType, BorderStyle, ParagraphChild, IImageOptions, ISpacingProperties } from "docx";
import { saveAs } from "file-saver";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loader } from '../../shared/components/loader/loader';

@Component({
  selector: 'app-tiny-mce-text-editor',
  standalone: true,
  imports: [CommonModule, EditorModule, MatIconModule, MatSnackBarModule, Loader],
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
  templateUrl: './tiny-mce-text-editor.html',
  styleUrl: './tiny-mce-text-editor.scss',
})
export class TinyMCETextEditor {
  @ViewChild('editor') editor!: EditorComponent;
  selectedFileName: string | null = null;
  loading: boolean = false;

  constructor(private snackBar: MatSnackBar) {

  }

  loadFile(event: any) {
    this.loading = true;
    const file = event.target.files[0];
    this.selectedFileName = file ? file.name : null;
    if (!file) return;

    // Clear editor
    if (this.editor && this.editor.editor) {
      this.editor.editor.setContent('');
    }

    if (file) {
      file.arrayBuffer().then((arrayBuffer: ArrayBuffer) => {
        mammoth
          .convertToHtml({
            arrayBuffer,
            convertImage: mammoth.images.imgElement((img) => {
              return img.read('base64').then((imageBuffer) => ({
                src: `data:${img.contentType};base64,${imageBuffer}`,
              }));
            }),
          } as any)
          .then((result) => {
            this.editor.editor.setContent('');
            this.editor.editor.setContent(result.value);

          this.snackBar.open(
            `Document${this.selectedFileName ? ` "${this.selectedFileName}"` : ''} imported successfully.`,
            undefined,
            {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            }
          );
          })
          .catch((err) => {
            console.error(err);
            // alert('Loaded file: ' + err.message);
          
            this.snackBar.open(`${err.message}`, '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
          });
      });
    }
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  // async saveFile() {
  //   const content = (this.editor?.editor?.getContent?.() ?? '').trim();
  //   const originalFilename = (this.selectedFileName ?? '').trim();

  //   if (!content) {
  //     if (!originalFilename) {
  //       alert('Please select a file.');
  //       return;
  //     }
  //     const ext = originalFilename.split('.').pop() ?? '';
  //     if (ext !== 'docx' && ext !== 'doc') {
  //       alert('Unsupported file type. Please select a .docx file.');
  //       return;
  //     }
  //     alert('The selected .docx file did not produce any content. Please select a valid .docx file.');
  //     return;
  //   }

  //   this.loading = true;

  //   try {
  //     const html = this.editor.editor?.getContent() || '';

  //     const parser = new DOMParser();
  //     const parsed = parser.parseFromString(html, 'text/html');
  //     const body = parsed.body;

  //     const paragraphs: Paragraph[] = [];

  //     const base64ToUint8Array = (base64: string) => {
  //       const binary = atob(base64);
  //       const len = binary.length;
  //       const bytes = new Uint8Array(len);
  //       for (let i = 0; i < len; i++) {
  //         bytes[i] = binary.charCodeAt(i);
  //       }
  //       return bytes;
  //     };

  //     function createTextRun(text: string, bold = false, italics = false, underline = false) {
  //       return new TextRun({
  //         text,
  //         bold,
  //         italics,
  //         underline: underline ? {} : undefined,
  //       });
  //     }

  //     function processInline(node: ChildNode, inherited: { bold?: boolean; italic?: boolean; underline?: boolean } = {}) : (TextRun | ExternalHyperlink | ImageRun)[] {
  //       const results: (TextRun | ExternalHyperlink | ImageRun)[] = [];

  //       if (node.nodeType === Node.TEXT_NODE) {
  //         const txt = (node.textContent || '').replace(/\u00A0/g, ''); // replace &nbsp;
  //         if (txt.trim().length > 0) {
  //           results.push(createTextRun(txt, !!inherited.bold, !!inherited.italic, !!inherited.underline));
  //         }
  //         return results;
  //       }

  //       if (node.nodeType !== Node.ELEMENT_NODE) return results;

  //       const el = node as Element;
  //       const tag = el.tagName.toLowerCase();

  //       const childInherited = { ...inherited };
  //       if (tag === 'b' || tag === 'strong') childInherited.bold = true;
  //       if (tag === 'i' || tag === 'em') childInherited.italic = true;
  //       if (tag === 'u') childInherited.underline = true;

  //       if (tag === 'img') {
  //         const src = el.getAttribute('src') || '';
  //         if (src.startsWith('data:')) {
  //           const commaIndex = src.indexOf(',');
  //           const base64 = commaIndex >= 0 ? src.substring(commaIndex + 1) : '';
  //           if (base64) {
  //               const data = base64ToUint8Array(base64);
  //               // default dimensions; docx expects pixels
  //               const width = 600;
  //               const height = 400;
  //               // ensure we provide a plain Uint8Array instance that matches docx types
  //               const uint8 = data instanceof Uint8Array ? data : new Uint8Array(data as any);
  //               results.push(new ImageRun({ data: uint8, transformation: { width, height } } as IImageOptions));
  //             }
  //         }
  //         return results;
  //       }

  //       if (tag === 'a') {
  //         const href = el.getAttribute('href') || '';
  //         // collect link text as runs
  //         const childrenRuns: TextRun[] = [];
  //         el.childNodes.forEach((c) => {
  //           if (c.nodeType === Node.TEXT_NODE) {
  //             const t = (c.textContent || '').trim();
  //             if (t) childrenRuns.push(createTextRun(t, !!childInherited.bold, !!childInherited.italic, !!childInherited.underline));
  //           } else {
  //             const inner = processInline(c, childInherited);
  //             inner.forEach(i => {
  //               if (i instanceof TextRun) childrenRuns.push(i);
  //             });
  //           }
  //         });
  //         if (childrenRuns.length === 0) {
  //           childrenRuns.push(createTextRun(href, !!childInherited.bold, !!childInherited.italic, !!childInherited.underline));
  //         }
  //         results.push(new ExternalHyperlink({ children: childrenRuns, link: href }));
  //         return results;
  //       }

  //       // block-level tags that should become their own paragraph are handled by the outer loop.
  //       // For other elements, recurse into children and collect runs.
  //       el.childNodes.forEach((c) => {
  //         results.push(...processInline(c, childInherited));
  //       });

  //       return results;
  //     }

  //     function elementToParagraphs(node: ChildNode) : Paragraph[] {
  //       const out: Paragraph[] = [];
  //       if (node.nodeType === Node.TEXT_NODE) {
  //         const txt = (node.textContent || '').trim();
  //         if (txt) out.push(new Paragraph({ children: [createTextRun(txt)] }));
  //         return out;
  //       }

  //       if (node.nodeType !== Node.ELEMENT_NODE) return out;

  //       const el = node as Element;
  //       const tag = el.tagName.toLowerCase();

  //       if (tag === 'br') {
  //         out.push(new Paragraph({ children: [createTextRun('')] }));
  //         return out;
  //       }

  //       if (tag === 'img') {
  //         const imgRuns = processInline(el);
  //         if (imgRuns.length > 0) out.push(new Paragraph({ children: imgRuns }));
  //         return out;
  //       }

  //       if (/h[1-6]/.test(tag)) {
  //         const level = parseInt(tag[1], 10);
  //         const runs = processInline(el);
  //         out.push(new Paragraph({
  //           children: runs,
  //           heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6][Math.max(0, Math.min(5, level - 1))],
  //         }));
  //         return out;
  //       }

  //       // treat block-level containers as single paragraph containing their inline children
  //       if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'article' || tag === 'li') {
  //         const runs = processInline(el);
  //         out.push(new Paragraph({ children: runs }));
  //         return out;
  //       }

  //       // fallback: recurse into children and convert each child separately
  //       el.childNodes.forEach((c) => {
  //         out.push(...elementToParagraphs(c));
  //       });

  //       return out;
  //     }

  //     body.childNodes.forEach((child) => {
  //       paragraphs.push(...elementToParagraphs(child));
  //     });

  //     // Ensure at least one paragraph (docx can't be empty)
  //     if (paragraphs.length === 0) {
  //       paragraphs.push(new Paragraph({ children: [createTextRun('')] }));
  //     }

  //     const doc = new Document({
  //       sections: [
  //         {
  //           properties: {},
  //           children: paragraphs,
  //         },
  //       ],
  //     });

  //     const blob = await Packer.toBlob(doc);
  //     const baseName = originalFilename ? originalFilename.replace(/\.[^/.]+$/, '') : 'exported';
  //     const outName = `${baseName}.docx`;
  //     saveAs(blob, outName);
  //   } catch (err: any) {
  //     console.error(err);
  //     alert('Failed to export DOCX: ' + (err?.message || err));
  //   } finally {
  //     setTimeout(() => {
  //       this.loading = false;
  //     }, 500);
  //   }
  // }

async saveFile() {
    const content = (this.editor?.editor?.getContent?.() ?? '').trim();
    const originalFilename = (this.selectedFileName ?? '').trim();

    if (!content) {
      if (!originalFilename) {
        alert('Please select a file.');
        return;
      }
      const ext = originalFilename.split('.').pop() ?? '';
      if (ext !== 'docx' && ext !== 'doc') {
        alert('Unsupported file type. Please select a .docx file.');
        return;
      }
      alert('The selected .docx file did not produce any content. Please select a valid .docx file.');
      return;
    }

    this.loading = true;

    try {
      const html = this.editor.editor?.getContent() || '';

      const parser = new DOMParser();
      const parsed = parser.parseFromString(html, 'text/html');
      const body = parsed.body;

      const elements: (Paragraph | Table)[] = [];

      const base64ToUint8Array = (base64: string) => {
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      };

      function createTextRun(text: string, bold = false, italics = false, underline = false) {
        return new TextRun({
          text,
          bold,
          italics,
          underline: underline ? {} : undefined,
        });
      }

      function getImageTypeFromDataUrl(dataUrl: string): string {
        const match = dataUrl.match(/^data:image\/(\w+);base64,/);
        return match ? match[1] : 'png'; // Default to png if not found
      }

      function processInline(node: ChildNode, inherited: { bold?: boolean; italic?: boolean; underline?: boolean } = {}): ParagraphChild[] {
        const results: ParagraphChild[] = [];

        if (node.nodeType === Node.TEXT_NODE) {
          const txt = (node.textContent || '').replace(/\u00A0/g, ' '); // replace &nbsp;
          if (txt.trim().length > 0) {
            results.push(createTextRun(txt, !!inherited.bold, !!inherited.italic, !!inherited.underline));
          }
          return results;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return results;

        const el = node as Element;
        const tag = el.tagName.toLowerCase();

        const childInherited = { ...inherited };
        if (tag === 'b' || tag === 'strong') childInherited.bold = true;
        if (tag === 'i' || tag === 'em') childInherited.italic = true;
        if (tag === 'u') childInherited.underline = true;

        if (tag === 'img') {
          const src = el.getAttribute('src') || '';
          if (src.startsWith('data:')) {
            const commaIndex = src.indexOf(',');
            const base64 = commaIndex >= 0 ? src.substring(commaIndex + 1) : '';
            if (base64) {
              const data = base64ToUint8Array(base64);
              const width = 400; // Default width
              const height = 300; // Default height
              const imageType = getImageTypeFromDataUrl(src);
              
              // Create ImageRun with proper configuration
              const imageOptions: IImageOptions = {
                data: data,
                transformation: {
                  width: width,
                  height: height,
                },
                type: imageType as any,
              };

              results.push(new ImageRun(imageOptions));
            }
          } else if (src) {
            // For non-data URLs, create a text placeholder
            results.push(createTextRun(`[Image: ${src}]`));
          }
          return results;
        }

        if (tag === 'a') {
          const href = el.getAttribute('href') || '';
          const childrenRuns: TextRun[] = [];
          el.childNodes.forEach((c) => {
            if (c.nodeType === Node.TEXT_NODE) {
              const t = (c.textContent || '').trim();
              if (t) childrenRuns.push(createTextRun(t, !!childInherited.bold, !!childInherited.italic, !!childInherited.underline));
            } else {
              const inner = processInline(c, childInherited);
              inner.forEach(i => {
                if (i instanceof TextRun) childrenRuns.push(i);
              });
            }
          });
          if (childrenRuns.length === 0) {
            childrenRuns.push(createTextRun(href, !!childInherited.bold, !!childInherited.italic, !!childInherited.underline));
          }
          results.push(new ExternalHyperlink({ children: childrenRuns, link: href }));
          return results;
        }

        // For other elements, recurse into children
        el.childNodes.forEach((c) => {
          results.push(...processInline(c, childInherited));
        });

        return results;
      }

      function processTableCell(cell: Element, isHeader: boolean = false): TableCell {
        const cellChildren: Paragraph[] = [];
        
        // Process all child nodes
        cell.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const text = (child.textContent || '').trim();
            if (text) {
              cellChildren.push(new Paragraph({ children: [createTextRun(text)] }));
            }
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const childEl = child as Element;
            const tag = childEl.tagName.toLowerCase();
            
            if (tag === 'p' || tag === 'div' || tag === 'span') {
              const runs = processInline(childEl);
              if (runs.length > 0) {
                cellChildren.push(new Paragraph({ children: runs }));
              }
            } else if (tag === 'br') {
              cellChildren.push(new Paragraph({ children: [createTextRun('')] }));
            } else if (tag === 'img') {
              const runs = processInline(childEl);
              if (runs.length > 0) {
                cellChildren.push(new Paragraph({ children: runs }));
              }
            } else if (tag === 'table') {
              // Handle nested tables
              const nestedTable = processTable(childEl);
              if (nestedTable) {
                // Tables can't be direct children of table cells in this context
                // Wrap in a paragraph or create a separate flow
                cellChildren.push(new Paragraph({ 
                  children: [createTextRun('[Nested Table]')] 
                }));
              }
            } else {
              // For other elements, process their text content
              const text = childEl.textContent?.trim();
              if (text) {
                cellChildren.push(new Paragraph({ children: [createTextRun(text)] }));
              }
            }
          }
        });

        // Ensure at least one paragraph in the cell
        if (cellChildren.length === 0) {
          cellChildren.push(new Paragraph({ children: [createTextRun('')] }));
        }

        return new TableCell({
          children: cellChildren,
          // Apply header styling if it's a th element
          ...(isHeader && {
            shading: {
              fill: "DDDDDD",
              type: ShadingType.CLEAR,
            }
          })
        });
      }

      function processTableRow(row: Element): TableRow {
        const cells: TableCell[] = [];
        
        // Process both td and th elements
        const tableCells = row.querySelectorAll('td, th');
        
        tableCells.forEach((cell) => {
          const isHeader = cell.tagName.toLowerCase() === 'th';
          cells.push(processTableCell(cell, isHeader));
        });

        // If no cells found (empty row), add one empty cell
        if (cells.length === 0) {
          cells.push(new TableCell({
            children: [new Paragraph({ children: [createTextRun('')] })]
          }));
        }

        return new TableRow({ children: cells });
      }

      function processTable(tableElement: Element): Table | null {
        const rows: TableRow[] = [];
        
        // Process all rows (tr elements)
        const tableRows = tableElement.querySelectorAll('tr');
        
        if (tableRows.length === 0) {
          return null;
        }
        
        tableRows.forEach((row) => {
          rows.push(processTableRow(row));
        });

        return new Table({
          rows: rows,
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
          },
        });
      }

      function elementToDocxElements(node: ChildNode): (Paragraph | Table)[] {
        const out: (Paragraph | Table)[] = [];
        
        if (node.nodeType === Node.TEXT_NODE) {
          const txt = (node.textContent || '').trim();
          if (txt) {
            out.push(new Paragraph({ children: [createTextRun(txt)] }));
          }
          return out;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return out;

        const el = node as Element;
        const tag = el.tagName.toLowerCase();

        // Handle tables
        if (tag === 'table') {
          const table = processTable(el);
          if (table) {
            out.push(table);
          }
          return out;
        }

        // Handle table rows/cells - these should be processed within table context only
        if (tag === 'tr' || tag === 'td' || tag === 'th') {
          // These are only valid inside tables, so skip them here
          return out;
        }

        if (tag === 'br') {
          out.push(new Paragraph({ children: [createTextRun('')] }));
          return out;
        }

        if (/h[1-6]/.test(tag)) {
          const level = parseInt(tag[1], 10);
          const runs = processInline(el);
          out.push(new Paragraph({
            children: runs,
            heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6][Math.max(0, Math.min(5, level - 1))],
          }));
          return out;
        }

        // Handle lists
        if (tag === 'ul' || tag === 'ol') {
          const listItems = el.querySelectorAll('li');
          listItems.forEach((li, index) => {
            const runs = processInline(li);
            const bullet = tag === 'ul' ? '•' : `${index + 1}.`;
            out.push(new Paragraph({
              children: [
                createTextRun(`${bullet}\t`),
                ...runs
              ]
            }));
          });
          return out;
        }

        // Handle block-level containers
        if (tag === 'p' || tag === 'div' || tag === 'section' || tag === 'article' || tag === 'li') {
          const runs = processInline(el);
          if (runs.length > 0) {
            out.push(new Paragraph({ children: runs }));
          }
          return out;
        }

        // Handle spans and other inline elements
        if (tag === 'span' || tag === 'b' || tag === 'strong' || tag === 'i' || tag === 'em' || tag === 'u' || tag === 'a') {
          const runs = processInline(el);
          if (runs.length > 0) {
            out.push(new Paragraph({ children: runs }));
          }
          return out;
        }

        // Fallback: process children recursively
        el.childNodes.forEach((child) => {
          out.push(...elementToDocxElements(child));
        });

        return out;
      }

      // Process all child nodes of the body
      body.childNodes.forEach((child) => {
        elements.push(...elementToDocxElements(child));
      });

      // Ensure at least one paragraph (docx can't be empty)
      if (elements.length === 0) {
        elements.push(new Paragraph({ children: [createTextRun('')] }));
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: elements,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const baseName = originalFilename ? originalFilename.replace(/\.[^/.]+$/, '') : 'exported';
      const outName = `${baseName}.docx`;
      saveAs(blob, outName);
    } catch (err: any) {
      console.error(err);
      alert('Failed to export DOCX: ' + (err?.message || err));
    } finally {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }
  


}
