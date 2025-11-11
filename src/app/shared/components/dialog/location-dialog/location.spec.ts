import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDialog } from './location';

describe('Location', () => {
  let component: LocationDialog;
  let fixture: ComponentFixture<LocationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
