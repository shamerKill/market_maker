import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighHandicapComponent } from './high-handicap.component';

describe('HighHandicapComponent', () => {
  let component: HighHandicapComponent;
  let fixture: ComponentFixture<HighHandicapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighHandicapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighHandicapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
