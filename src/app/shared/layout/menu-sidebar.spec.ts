import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSidebar } from './menu-sidebar';

describe('MenuSidebar', () => {
  let component: MenuSidebar;
  let fixture: ComponentFixture<MenuSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
