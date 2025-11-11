import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetitionerDialog} from './petitioner';

describe('Petitioner', () => {
  let component: PetitionerDialog
  let fixture: ComponentFixture<PetitionerDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetitionerDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetitionerDialog)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
