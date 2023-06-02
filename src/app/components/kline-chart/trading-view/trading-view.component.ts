import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'lib-trading-view',
  templateUrl: './trading-view.component.html',
  styleUrls: ['./trading-view.component.scss']
})
export class TradingViewComponent implements AfterViewInit {

  tradingId = `trading_view_${Math.random().toString(36).substring(2)}}`;


  constructor() { }

  ngAfterViewInit(): void {
    this.loadTradingView();
  }

  async checkScript(): Promise<boolean> {
    const tradingSrc = 'https://s3.tradingview.com/tv.js';
    let body = document.querySelector('body');
    if (!body) {
      body = document.createElement('body');
      document.body.appendChild(body);
    }
    const bodyChildren = body.children;
    for (let i = 0; i < bodyChildren.length; i++) {
      if (bodyChildren[i].nodeName === 'SCRIPT') {
        const item = bodyChildren[i] as HTMLScriptElement;
        if (item.src === tradingSrc) return true;
      }
    }
    const script = document.createElement('script');
    script.src = tradingSrc;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
    return new Promise((resolve, reject) => {
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        reject(false);
      };
    });
  }

  async loadTradingView() {
    if (!(await this.checkScript())) return;
    new (window as any).TradingView.widget({
      "autosize": true,
      "symbol": "NASDAQ:AAPL",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "zh_CN",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": this.tradingId
    });
  }
}
