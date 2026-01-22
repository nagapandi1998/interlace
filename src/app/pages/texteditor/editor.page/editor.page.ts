import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { SuperDoc } from '@harbour-enterprises/superdoc';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../shared/service/toaster/toast-service';
import { Loader } from '../../../shared/components/loader/loader';
import Typo from 'typo-js';

type InsertMode = 'inline' | 'block';

interface TemplateField {
  key: string;
  label: string;
  mode: InsertMode;
}

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, Loader],
  templateUrl: './editor.page.html',
  styleUrl: './editor.page.scss',
})
export class TextEditorPage implements AfterViewInit {
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

  private TEMPLATE_FIELDS: TemplateField[] = [
    { key: 'case_number', label: 'Case Number:', mode: 'inline' },
    { key: 'report_date', label: 'Report Date:', mode: 'inline' },
    { key: 'suspect_name', label: 'Suspect Name:', mode: 'inline' },
    { key: 'suspect_age', label: 'Age:', mode: 'inline' },
    { key: 'suspect_position', label: 'Position:', mode: 'inline' },
    { key: 'allegation_summary', label: '1. Allegation Summary', mode: 'block' },
    { key: 'investigation_findings', label: '2. Investigation Findings', mode: 'block' },
    { key: 'evidence_collected', label: '3. Evidence Collected', mode: 'block' },
    { key: 'observations', label: '4. Observations', mode: 'block' },
    { key: 'recommendation', label: '5. Recommendation / Conclusion', mode: 'block' },
    { key: 'officer_name', label: 'Investigating Officer Name:', mode: 'inline' },
    { key: 'officer_designation', label: 'Designation:', mode: 'inline' },
  ];

  constructor(
    private zone: NgZone,
    private toastService: ToastService,
  ) {}

  // Initialize SuperDoc editor
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

  importDocument() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.loading = true;

      setTimeout(() => {
        // this.initializeEditor(file);
        this.createEditor(file);

        this.loading = false;

        this.toastService.showMsg('success', `"${file.name}" was imported successfully.`);

        // Allow re-import of the same file
        this.fileInput.nativeElement.value = '';
      }, 0);
    }
    this.loading = false;
  }

  resetDocument() {
    // this.initializeEditor(null);
    this.createEditor();
    this.fileInput.nativeElement.value = '';
    this.toastService.showMsg('success', 'Editor has been cleared.');
  }

  async loadCaseTemplate() {
    this.loading = true;

    try {
      const response = await fetch('/assets/file/Case_file.docx');
      if (!response.ok) {
        throw new Error('Failed to load template');
      }
      const blob = await response.blob();
      const file = new File([blob], 'Case_file.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        lastModified: Date.now(),
      });

      // document.getElementById('superdoc')!.innerHTML = '';
      // this.initializeEditor(file);
      this.createEditor(file);

      this.toastService.showMsg('success', `"Case_file.docx" loaded successfully.`);
    } catch (error) {
      console.error(error);
      this.toastService.showMsg('error', 'Could not load template.');
    } finally {
      this.loading = false;
    }
  }

  private getEditorText(): string {
    if (!this.editor || !this.editor.activeEditor) return '';
    // ProseMirror doc
    const doc = this.editor.activeEditor.view.state.doc;
    // Convert to plain text
    const text = doc.textContent?.trim() || '';
    return text;
  }

  async exportDocument(): Promise<void> {
    if (!this.editor) {
      this.toastService.showMsg('error', 'Editor is not initialized.');
      return;
    }

    this.loading = true;

    try {
      const text = this.getEditorText();

      if (!text) {
        this.toastService.showMsg('warning', 'No text was found in the editor.');
        return;
      }

      // rename & method
      await this.editor.export({
        exportType: ['docx'],
        exportedName: 'DVAC Doc.docx',
      });

      this.toastService.showMsg('success', 'File has been exported successfully.');
    } catch (err: any) {
      this.toastService.showMsg('error', err?.message || 'An unexpected error occurred.');
      console.error('Export error:', err);
    } finally {
      setTimeout(() => (this.loading = false), 200);
    }
  }

  extractCaseData() {
    const data = this.fetchDataFromEditor();
    // console.log('Extracted case data:', data);

    const suspectData = {
      caseNumber: data['case_number'],
      reportDate: data['report_date'],
      suspectName: data['suspect_name'],
      suspectAge: data['suspect_age'],
      suspectPosition: data['suspect_position'],
      allegationSummary: data['allegation_summary'],
      investigationFindings: data['investigation_findings'],
      evidenceCollected: data['evidence_collected'],
      observations: data['observations'],
      recommendation: data['recommendation'],
      officerName: data['officer_name'],
      officerDesignation: data['officer_designation'],
    };

    console.log('Suspect Data:', suspectData);
  }

  fetchDataFromEditor(): Record<string, string> {
    if (!this.editor?.activeEditor) return {};

    const text = this.editor.activeEditor.view.state.doc.textContent || '';
    const result: Record<string, string> = {};

    for (let i = 0; i < this.TEMPLATE_FIELDS.length; i++) {
      const current = this.TEMPLATE_FIELDS[i];
      const next = this.TEMPLATE_FIELDS[i + 1];

      const pattern = next
        ? `${current.label}\\s*(.*?)\\s*(?=(\\d+\\.\\s*)?${next.label})`
        : `${current.label}\\s*(.*)$`;

      const regex = new RegExp(pattern, 'is');
      const match = text.match(regex);

      result[current.key] = match ? match[1].trim() : '';
    }

    return result;
  }

  private findLabelEnd(doc: any, label: string): number | null {
    let fullText = '';
    const map: { pos: number; text: string }[] = [];

    // Build a map of text positions
    doc.descendants((node: any, pos: number) => {
      if (!node.isText) return;
      fullText += node.text;
      map.push({ pos, text: node.text });
    });

    // Find index of label in full text
    const idx = fullText.indexOf(label);
    if (idx === -1) return null;

    // Map fullText index back to ProseMirror position
    let count = 0;
    for (const m of map) {
      const end = count + m.text.length;
      if (end >= idx + label.length) {
        return m.pos + (idx + label.length - count);
      }
      count = end;
    }

    return null;
  }

  private hasValueAfterLabel(doc: any, label: string, nextLabel?: string): boolean {
    const text = doc.textContent || '';

    const pattern = nextLabel ? `${label}\\s*(.*?)\\s*(?=${nextLabel})` : `${label}\\s*(.*)$`;

    const regex = new RegExp(pattern, 'is');
    const match = text.match(regex);

    return !!(match && match[1]?.trim());
  }

  populateCaseData() {
    const data = {
      case_number: 'DVAC/2025/001',
      report_date: '02-01-2026',
      suspect_name: 'Krishnan V',
      suspect_age: '42',
      suspect_position: 'Inspector',
      allegation_summary: 'Allegation of misuse of official authority for personal gain.',
      investigation_findings:
        'Investigation revealed consistent patterns of actions violating official duties, supported by documentary evidence and witness statements.',
      evidence_collected:
        'Official records, transaction logs, and witness testimonies corroborating misuse of position.',
      observations:
        'Actions of the accused indicate repeated misconduct and failure to adhere to ethical and legal standards.',
      recommendation:
        'Based on the evidence, it is recommended to initiate disciplinary proceedings and further legal action as per applicable regulations.',
      officer_name: 'R. Kumar',
      officer_designation: 'Deputy Superintendent',
    };

    // this.applyCaseDataToDocument(data);
    setTimeout(() => {
      this.applyCaseDataToDocument(data);
    }, 0);
  }

  applyCaseDataToDocument(data: Record<string, string>) {
    const editor = this.editor?.activeEditor;
    if (!editor) {
      this.toastService.showMsg('warning', 'Editor is not initialized.');
      return;
    }

    const { state, dispatch } = editor.view;
    let tr = state.tr;

    const inserts: { pos: number; value: string; mode: 'inline' | 'block' }[] = [];

    // Prepare all insertions
    for (let i = 0; i < this.TEMPLATE_FIELDS.length; i++) {
      const field = this.TEMPLATE_FIELDS[i];
      const nextField = this.TEMPLATE_FIELDS[i + 1];

      const value = data[field.key];
      if (!value) continue;

      const pos = this.findLabelEnd(state.doc, field.label);
      if (pos === null) continue;

      // Prevent Double Insert
      const alreadyFilled = this.hasValueAfterLabel(state.doc, field.label, nextField?.label);

      if (alreadyFilled) continue;

      inserts.push({
        pos,
        value,
        mode: field.mode,
      });
    }

    // Sort inserts in reverse order
    inserts.sort((a, b) => b.pos - a.pos);

    for (const item of inserts) {
      if (item.mode === 'inline') {
        tr = tr.insertText(` ${item.value}`, item.pos); // rely on default font
      } else {
        // Block insert with Arial style
        const p = state.schema.nodes.paragraph.create(
          { style: 'font-family: Arial; font-size: 12pt;' },
          state.schema.text(item.value),
        );
        tr = tr.insert(item.pos + 1, p);
      }
    }

    if (tr.docChanged) {
      dispatch(tr);
      // this.toastService.showMsg('success', 'Data inserted successfully.');
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
}
