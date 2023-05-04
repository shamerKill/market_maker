import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotLogsComponent } from './robot-logs.component';

describe('RobotLogsComponent', () => {
  let component: RobotLogsComponent;
  let fixture: ComponentFixture<RobotLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
