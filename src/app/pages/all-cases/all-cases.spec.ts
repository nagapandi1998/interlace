import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCases } from './all-cases';

describe('AllCases', () => {
  let component: AllCases;
  let fixture: ComponentFixture<AllCases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCases]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
