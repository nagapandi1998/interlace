import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCasesPage } from './all-cases.page';

describe('AllCases', () => {
  let component: AllCasesPage;
  let fixture: ComponentFixture<AllCasesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCasesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
