import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapForm } from './bootstrap-form';

describe('BootstrapForm', () => {
  let component: BootstrapForm;
  let fixture: ComponentFixture<BootstrapForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BootstrapForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
