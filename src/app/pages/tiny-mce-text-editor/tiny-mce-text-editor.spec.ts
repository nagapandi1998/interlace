import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyMCETextEditor } from './tiny-mce-text-editor';

describe('TinyMCETextEditor', () => {
  let component: TinyMCETextEditor;
  let fixture: ComponentFixture<TinyMCETextEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TinyMCETextEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TinyMCETextEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
