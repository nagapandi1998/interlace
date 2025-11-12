import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDialog } from './document-dialog';

describe('DocumentDialog', () => {
  let component: DocumentDialog;
  let fixture: ComponentFixture<DocumentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
