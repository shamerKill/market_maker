import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { SocketService } from 'src/app/services/socket/socket.service';
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
  ]

  // 量化工具表单
  toolType?: 'sell'|'buy'|'back';
  toolFormValue: {[key in 'priceMin'|'priceMax'|'numberMin'|'numberMax'|'allOrder'|'decimal']: string} & {isLoading: boolean} = {
    priceMin: '',
    priceMax: '',
    numberMin: '',
    numberMax: '',
    allOrder: '',
    decimal: '',
    isLoading: false,
  };

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
    private modal: NzModalService,
    private socket: SocketService,
  ) {
  }

  ngOnInit(): void {
    try {
      this.platform = JSON.parse(window.localStorage.getItem('maker_platform')||'');
      this.symbols.next(JSON.parse(window.localStorage.getItem('maker_symbols')||''));
      this.selectModalValue.platformValue = this.platform?.mark || '';
      this.selectModalValue.symbolOneValue = this.symbols.getValue()[0] || '';
      this.selectModalValue.symbolTwoValue = this.symbols.getValue()[1] || '';
      this._onWatchPair();
    } catch {}
    // 如果没有盘口，选择盘口
    if (this.symbols.getValue().length === 0) {
      this.onSelectPlatform(true);
    }

    this.socket.getSocketClient().subscribe(res => {
      console.log(res);
    });
    this.socket.getSocketClient().error((err: any) => {
      console.log(err);
    });
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

  // 检测币种更改
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
    this._getWalletBalance();
  }

  // 获取余额
  private _getWalletBalance() {
    this.http.get('/handle/balance', {pairs: this.symbols.getValue().join('_'), mark: this.platform?.mark||''}, {withToken: true})
      .subscribe(res => {
        if (res.errno !== 200) {
          this.message.error(res.errmsg);
          return;
        }
        if (res.data.length === 0) {
          this.message.error('获取余额失败');
          return;
        }
        this.mainWallet = res.data.map((item: any) => {
          return {
            symbol: item.name,
            total: toolNumberAdd(item.balance, item.freeze),
            available: item.balance,
            frozen: item.freeze,
          };
        });
      });
  }

  // 手动下单
  onManualOrder(type: string) {
    // 获取价格
    const price = this.manualOrder.price;
    // 获取数量
    const number = this.manualOrder.number;
    const confirm = this.modal.confirm({
      nzTitle: '确认下单',
      nzContent: `价格：${price} <small>${this.symbols.getValue()[0]}/${this.symbols.getValue()[1]}</small> <br/> 数量：${number}`,
      nzOnOk: () => {
        confirm.updateConfig({nzOkLoading: true});
        this.http.post('/handle/order', {
          mark: this.platform?.mark,
          pairs: this.symbols.getValue().join('_'),
          side: type,
          price,
          num: number,
        }, {withToken: true}).subscribe(res => {
          if (res.errno !== 200) {
            this.message.error(res.errmsg);
            return;
          }
          this.message.success('下单成功');
          this._getWalletBalance();
          confirm.destroy();
        });
        return false;
      },
    });
  }

  // 批量下单
  onBatchOrder() {
    if (this.toolFormValue.isLoading) return;
    if (parseFloat(this.toolFormValue.priceMax) - parseFloat(this.toolFormValue.priceMin) <= 0) {
      this.message.warning('价格区间不正确');
      return;
    }
    if (parseFloat(this.toolFormValue.numberMax) - parseFloat(this.toolFormValue.numberMin) <= 0) {
      this.message.warning('数量区间不正确');
      return;
    }
    if (!this.toolFormValue.allOrder) {
      this.message.warning('总单数量错误');
      return;
    }
    if (!this.toolFormValue.decimal) {
      this.message.warning('价格精度错误');
      return;
    }
    const confirm = this.modal.confirm({
      nzTitle: '确认下' + (this.toolType === 'buy' ? '买' : '卖') + '单',
      nzContent: `价格：${this.toolFormValue.priceMin} ~ ${this.toolFormValue.priceMax} <small>${this.symbols.getValue()[0]}/${this.symbols.getValue()[1]}</small> <br/> 数量：${this.toolFormValue.numberMin} ~ ${this.toolFormValue.numberMax} <br/> 总单数：${this.toolFormValue.allOrder}`,
      nzOnOk: () => {
        this.toolFormValue.isLoading = true;
        confirm.updateConfig({nzOkLoading: true});
        this.http.post('/handle/batch', {
          pairs: this.symbols.getValue().join('_'),
          mark: this.platform?.mark,
          side: this.toolType,
          min_price: this.toolFormValue.priceMin,
          max_price: this.toolFormValue.priceMax,
          min_num: this.toolFormValue.numberMin,
          max_num: this.toolFormValue.numberMax,
          count: this.toolFormValue.allOrder,
          decimal: this.toolFormValue.decimal,
        }, {withToken: true}).subscribe(res => {
          this.toolFormValue.isLoading = false;
          confirm.destroy();
          if (res.errno !== 200) {
            this.message.error(res.errmsg);
            return;
          }
          this.message.success('下单成功');
          this.toolFormValue.allOrder = '';
          this.toolFormValue.decimal = '';
          this.toolFormValue.priceMin = '';
          this.toolFormValue.priceMax = '';
          this.toolFormValue.numberMin = '';
          this.toolFormValue.numberMax = '';
          this._getWalletBalance();
        });
        return false;
      }
    });
  }

  // 批量撤单
  onBatchCancel() {
    if (this.toolFormValue.isLoading) return;
    if (parseFloat(this.toolFormValue.priceMax) - parseFloat(this.toolFormValue.priceMin) <= 0) {
      this.message.warning('价格区间不正确');
      return;
    }
    if (parseFloat(this.toolFormValue.numberMax) - parseFloat(this.toolFormValue.numberMin) <= 0) {
      this.message.warning('数量区间不正确');
      return;
    }
    const confirm = this.modal.confirm({
      nzTitle: '确认撤单',
      nzContent: `价格：${this.toolFormValue.priceMin} ~ ${this.toolFormValue.priceMax} <small>${this.symbols.getValue()[0]}/${this.symbols.getValue()[1]}</small> <br/> 数量：${this.toolFormValue.numberMin} ~ ${this.toolFormValue.numberMax}`,
      nzOnOk: () => {
        this.toolFormValue.isLoading = true;
        confirm.updateConfig({nzOkLoading: true});
        this.http.post('/handle/batch_kill', {
          pairs: this.symbols.getValue().join('_'),
          mark: this.platform?.mark,
          min_price: this.toolFormValue.priceMin,
          max_price: this.toolFormValue.priceMax,
          min_num: this.toolFormValue.numberMin,
          max_num: this.toolFormValue.numberMax,
        }, {withToken: true}).subscribe(res => {
          this.toolFormValue.isLoading = false;
          confirm.destroy();
          if (res.errno !== 200) {
            this.message.error(res.errmsg);
            return;
          }
          this.message.success('撤单成功');
          this.toolFormValue.allOrder = '';
          this.toolFormValue.decimal = '';
          this.toolFormValue.priceMin = '';
          this.toolFormValue.priceMax = '';
          this.toolFormValue.numberMin = '';
          this.toolFormValue.numberMax = '';
          this._getWalletBalance();
        });
        return false;
      }
    });
  }
}
