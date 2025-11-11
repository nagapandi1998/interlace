import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardStandingCounselDialog } from './board-standing-counsel-dialog';

describe('BoardStandingCounselDialog', () => {
  let component: BoardStandingCounselDialog;
  let fixture: ComponentFixture<BoardStandingCounselDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardStandingCounselDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardStandingCounselDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
