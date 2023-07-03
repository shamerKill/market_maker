import { AfterViewInit, Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { toolNumberAdd, toolNumberCut } from 'src/app/tools/number';

@Component({
  selector: 'lib-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements AfterViewInit {
  selectModalValue = {
    isVisible: false,
    collectionValue: '',
    platformValue: '',
    symbolOneValue: '',
    symbolTwoValue: '',
  }

  // 平台
  platform: string = '币安';
  // 币种
  symbol: string = 'BTC/USDT';
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
  ) { }

  ngAfterViewInit(): void {
  }


  onSwitchCollected() {
    this.isCollected = !this.isCollected;
    if (this.isCollected) {
      this.message.success('收藏成功');
    } else {
      this.message.success('取消收藏成功');
    }
  }

  onSelectPlatform(type: boolean) {
    this.selectModalValue.isVisible = type;
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
}
