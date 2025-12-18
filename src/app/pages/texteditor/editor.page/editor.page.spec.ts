import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorPage } from './editor.page';

describe('TextEditor', () => {
  let component: TextEditorPage;
  let fixture: ComponentFixture<TextEditorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextEditorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
