import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePage } from './case.page';

describe('Case', () => {
  let component: CasePage;
  let fixture: ComponentFixture<CasePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
