import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbSearchComponent } from './awb-search.component';

describe('AwbSearchComponent', () => {
  let component: AwbSearchComponent;
  let fixture: ComponentFixture<AwbSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwbSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
