import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { toolNumberAdd, toolNumberCut } from 'src/app/tools/number';

@Component({
  selector: 'lib-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit, AfterViewInit {
  selectModalValue = {
    isVisible: false,
    collectionValue: '',
    platformValue: '',
    symbolOneValue: '',
    symbolTwoValue: '',
  }

  collectionList: {name: string, mark: string, symbols: string[]}[] = JSON.parse(window.localStorage.getItem('maker_collection') || '[]') || [];

  exchangeList: {name: string, mark: string, logo: string}[] = [];
  // 平台
  platform?: {name: string, mark: string, logo?: string};
  // 币种
  symbols: BehaviorSubject<string[]> = new BehaviorSubject([] as string[]);
  // 是否被收藏
  isCollected: boolean = false;

  // 手动下单
  manualOrder: {[key in 'price'|'number'|'priceStep'|'numberStep']: string} = {
    price: '0',
    number: '0',
    priceStep: '0.1',
    numberStep: '0.1'
  }
  // 主钱包资产
  mainWallet: {[key in 'symbol'|'total'|'available'|'frozen']: string}[] = [
    { symbol: 'BTC', total: '0', available: '0', frozen: '0' },
    { symbol: 'USDT', total: '0', available: '0', frozen: '0' },
  ]

  // 当前盘口
  isSimpleBookList: boolean = true;
  sellOrderBookList: {[key in 'price'|'number']: string}[] = [
    { price: '0', number: '0' },
  ]
  buyOrderBookList: {[key in 'price'|'number']: string}[] = [
    { price: '0', number: '0' },
  ]

  // 订单列表
  orderList: {
    total: number,
    list: {
      price: string,
      number: string,
      directive: 'buy'|'sell',
      time: Date,
      successOrder: string,
      cancelOrder: string,
    }[],
  } = {
    total: 0,
    list: []
  };

  // 机器人列表
  robotList: {
    total: number,
    list: []
  } = {
    total: 0,
    list: []
  };


  actionType: number = 0;
  tabType: number = 0;


  constructor(
    private message: NzMessageService,
    private http: HttpService,
  ) { }

  ngOnInit(): void {
    try {
      this.platform = JSON.parse(window.localStorage.getItem('maker_platform')||'');
      this.symbols.next(JSON.parse(window.localStorage.getItem('maker_symbols')||''));
      this.selectModalValue.platformValue = this.platform?.mark || '';
      this.selectModalValue.symbolOneValue = this.symbols.getValue()[0] || '';
      this.selectModalValue.symbolTwoValue = this.symbols.getValue()[1] || '';
    } catch {}
    // 如果没有盘口，选择盘口
    if (this.symbols.getValue().length === 0) {
      this.onSelectPlatform(true);
    }
  }

  ngAfterViewInit(): void {
  }


  onSwitchCollected() {
    this.isCollected = !this.isCollected;
    if (!this.platform) return;
    if (this.isCollected) {
      this.collectionList.push({name: this.platform?.name, mark: this.platform?.mark, symbols: this.symbols.getValue()});
      window.localStorage.setItem('maker_collection', JSON.stringify(this.collectionList));
      this.message.success('收藏成功');
    } else {
      this.collectionList = this.collectionList.filter(item => item.mark !== this.platform?.mark);
      window.localStorage.setItem('maker_collection', JSON.stringify(this.collectionList));
      this.message.success('取消收藏成功');
    }
  }

  onSelectPlatform(type: boolean) {
    this.selectModalValue.isVisible = type;
    // 获取交易所列表
    if (type === true) {
      if (this.exchangeList.length === 0) {
        this.http.get('/exchange').subscribe(res => {
          if (res.errno !== 200) {
            this.message.error(res.errmsg);
            return;
          }
          this.exchangeList = res.data;
        });
      }
    }
  }

  onSwitchSimpleBookList() {
    this.isSimpleBookList = !this.isSimpleBookList;
  }

  onManualOrderPriceChange(type: 'add'|'cut') {
    if (type === 'add') {
      this.manualOrder.price = toolNumberAdd(this.manualOrder.price, this.manualOrder.priceStep);
    } else {
      const price = toolNumberCut(this.manualOrder.price, this.manualOrder.priceStep);
      if (Number(price) >= 0) this.manualOrder.price = price;
    }
  }

  onManualOrderNumberChange(type: 'add'|'cut') {
    if (type === 'add') {
      this.manualOrder.number = toolNumberAdd(this.manualOrder.number, this.manualOrder.numberStep);
    } else {
      const num = toolNumberCut(this.manualOrder.number, this.manualOrder.numberStep);
      if (Number(num) >= 0) this.manualOrder.number = num;
    }
  }

  onWatchCollectionInput(event: number) {
    const select = this.collectionList[event];
    this.selectModalValue.platformValue = select.mark;
    this.selectModalValue.symbolOneValue = select.symbols[0];
    this.selectModalValue.symbolTwoValue = select.symbols[1];
  }

  onSelectPairs() {
    if (!this.selectModalValue.platformValue || !this.selectModalValue.symbolOneValue || !this.selectModalValue.symbolTwoValue)  {
      this.message.warning('请检查列表是否选择完整');
      return;
    }
    this.platform = this.exchangeList.find(item => item.mark === this.selectModalValue.platformValue);
    this.symbols.next([this.selectModalValue.symbolOneValue, this.selectModalValue.symbolTwoValue]);
    this.onSelectPlatform(false);
    this._onWatchPair();
  }

  private _onWatchPair() {
    window.localStorage.setItem('maker_platform', JSON.stringify(this.platform));
    window.localStorage.setItem('maker_symbols', JSON.stringify(this.symbols.getValue()));
    if (this.collectionList.find(item =>
      item.mark === this.platform?.mark
      && item.symbols.includes(this.selectModalValue.symbolOneValue)
      && item.symbols.includes(this.selectModalValue.symbolTwoValue)
    )) {
      this.isCollected = true;
    } else {
      this.isCollected = false;
    }
  }
}
