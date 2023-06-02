import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlineChartComponent } from './kline-chart.component';

describe('KlineChartComponent', () => {
  let component: KlineChartComponent;
  let fixture: ComponentFixture<KlineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlineChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KlineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
