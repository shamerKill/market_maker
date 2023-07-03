import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lib-trading-view',
  templateUrl: './trading-view.component.html',
  styleUrls: ['./trading-view.component.scss'],
})
export class TradingViewComponent implements AfterViewInit {

  tradingId = `trading_view_${Math.random().toString(36).substring(2)}}`;
  @ViewChild('tradingBox') tradingView?: ElementRef<HTMLDivElement>;


  constructor() { }

  ngAfterViewInit(): void {
    this.loadTradingView();
  }

  async loadTradingView() {
    // const iframe = document.createElement('iframe');
    // iframe.src = 'https://www.xt.com/zh-CN/trade/pc_usdt';
    // iframe.style.width = '100%';
    // iframe.style.height = '100%';
    // if (this.tradingView) {
    //   this.tradingView.nativeElement.appendChild(iframe);
    // }
    // iframe.onload = (e) => {
    //   console.log(e);
    //   console.log('加载完毕');
    // };
    // iframe.onerror = () => {
    //   console.log('加载失败');
    // }
  }
}
