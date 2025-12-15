import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPermissionPage } from './menu-permission.page';

describe('MenuPermissionPage', () => {
  let component: MenuPermissionPage;
  let fixture: ComponentFixture<MenuPermissionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPermissionPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
