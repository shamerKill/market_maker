import { HttpService } from './../../../services/http/http.service';
import { kLineOptions, getOptionSerise, getOptionTitle, TypeKlineValue } from './echarts.options';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { init as EchartInit, ECharts, EChartOption } from 'echarts';
import formatTime from '../../../tools/time';
import { SocketService } from 'src/app/services/socket/socket.service';
import { BehaviorSubject, filter } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'lib-echarts-view',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.scss']
})
export class EchartsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input('symbol') symbol?: string;
  @Input('exchange') exchange?: string;
  @Input('timeType') timeType: '1m'|'5m'|'15m'|'1h'|'4h'|'1d' = '1m';
  @Output() timeTypeChange = new EventEmitter<string>();
  // 显示时间段
  // 页面显示时间段
  timeTypeArr: {text: string; type: EchartsComponent['timeType'] }[] = [
    { text: '1分', type: '1m' },
    { text: '5分', type: '5m' },
    { text: '15分', type: '15m' },
    { text: '1时', type: '1h' },
    { text: '4时', type: '4h' },
    { text: '1天', type: '1d' },
  ];
  kLine: BehaviorSubject<TypeKlineValue[]> = new BehaviorSubject<TypeKlineValue[]>([]);

  // 行情图0,深度图1
  @Input() chartType: 0|1 = 0;

  echarts?: ECharts;
  @ViewChild('echarts') echartsEl?: ElementRef<HTMLDivElement>;

  constructor(
    private socket: SocketService,
    private http: HttpService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.kLine.subscribe(res => {
      const newOptions: EChartOption = {
        xAxis: [
          { data: res.map(item => item.time) },
          { data: res.map(item => item.time) },
          { data: res.map(item => item.time) },
        ],
        series: getOptionSerise(res),
      };
      newOptions.title = getOptionTitle(newOptions.series);
      this.echarts?.setOption(newOptions);
    });
  }

  ngAfterViewInit() {
    this.resetEcharts();
    window.addEventListener('resize', () => {
      this.echarts?.resize();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['symbol']?.currentValue !== changes['symbol']?.previousValue ||
      changes['exchange']?.currentValue !== changes['exchange']?.previousValue
    ) {
      this.resetKline();
    }
  }

  ngOnDestroy() {
  }
  resetEcharts() {
    setTimeout(() => {
      if (!this.echartsEl) return;
      this.echarts = EchartInit(this.echartsEl.nativeElement);
      this.echarts.setOption(kLineOptions(this.kLine.getValue()));
    }, 1000);
  }

  resetKline() {
    this.socket.sendMessage(
      {"symbol": this.symbol,"timeframe":this.timeType}
    );
    this.kLine.next([]);
    this.getFirstKline();
    this.getKline();
  }

  // 获取第一个k线
  getFirstKline() {
    this.http.get('/order/kline', {
      mark: this.exchange||'',
      timeframe: this.timeType,
      pairs: this.symbol||'',
    }, {withToken: true}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.formatKLineData(res.data);
    });
  }

  // 读取k线
  getKline() {
    this.socket.getSocketClient().pipe(
      filter(res => res.type === 'kline'),
    ).subscribe(res => {
      this.formatKLineData(res.data);
    });
  }

  // 获取socket需要时间数据
  private getStartTime = (length = 500, endTime = new Date().getTime()) => {
    let startTime = 0;
    let fmTimeStr = 'MM-DD';
    if (this.timeType === '1m') {
      startTime = endTime - length * 60 * 1000;
      fmTimeStr = 'hh:mm';
    } else if (this.timeType === '5m') {
      startTime = endTime - length * 5 * 60 * 1000;
      fmTimeStr = 'hh:mm';
    } else if (this.timeType === '15m') {
      startTime = endTime - length * 15 * 60 * 1000;
      fmTimeStr = 'MM-DD hh:mm';
    } else if (this.timeType === '1h') {
      startTime = endTime - length * 60 * 60 * 1000;
      fmTimeStr = 'MM-DD hh';
    } else if (this.timeType === '4h') {
      startTime = endTime - length * 4 * 60 * 60 * 1000;
      fmTimeStr = 'MM-DD hh';
    } else if (this.timeType === '1d') {
      startTime = endTime - length * 24 * 60 * 60 * 1000;
      fmTimeStr = 'MM-DD';
    }
    return {
      startTime,
      fmTimeStr,
      endTime,
    };
  };

  // 处理socket获取到的k线数据
  formatKLineData(data: any) {
    if (Array.isArray(data)) {
      const kLineArr = data.map(item => ({
        time: formatTime(this.getStartTime().fmTimeStr, Number(item.timestamp)),
        maxPrice: item.hight,
        minPrice: item.low,
        openPrice: item.open,
        closePrice: item.close,
        volume: item.value,
        create_unix: item.timestamp,
        kTime: this.timeType,
      }));
      this.kLine.next(kLineArr);
      this.socket.getSocketClient().next({
        type: 'web-price',
        data: {
          direction: data[data.length - 1].close - data[data.length - 2].close > 0 ? 'up' : 'down',
          close: data[data.length - 1].close,
        }
      });
    } else {
      if (this.kLine.getValue().length === 0) return;
      const oldData = [...this.kLine.getValue()];
      if (data.timestamp === oldData[oldData.length - 1].create_unix) {
        oldData.splice(-1, 1);
      }
      const obj = {
        time: formatTime(this.getStartTime().fmTimeStr, Number(data.timestamp)),
        maxPrice: `${(data.hight)}`,
        minPrice: `${(data.low)}`,
        openPrice: `${(data.open)}`,
        closePrice: `${(data.close)}`,
        volume: data.value,
        create_unix: data.timestamp,
        kTime: this.timeType,
      };
      oldData.push(obj);
      this.kLine.next(oldData);
      this.socket.getSocketClient().next({
        type: 'web-price',
        data: {
          direction: parseFloat(oldData[data.length - 1].closePrice) - parseFloat(oldData[data.length - 2].closePrice) > 0 ? 'up' : 'down',
          close: data.close,
        }
      });
    }
  }

  // 更改时间段
  changeTime(type: EchartsComponent['timeType']) {
    if (this.timeType === type) return;
    this.timeType = type;
    this.resetKline();
    this.timeTypeChange.emit(type);
  }

}
