import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondentDialog } from './respondent-dialog';

describe('RespondentDialog', () => {
  let component: RespondentDialog;
  let fixture: ComponentFixture<RespondentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespondentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespondentDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
