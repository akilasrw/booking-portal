import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreighterBookingCreateComponent } from './freighter-booking-create.component';

describe('FreighterBookingCreateComponent', () => {
  let component: FreighterBookingCreateComponent;
  let fixture: ComponentFixture<FreighterBookingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreighterBookingCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreighterBookingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
