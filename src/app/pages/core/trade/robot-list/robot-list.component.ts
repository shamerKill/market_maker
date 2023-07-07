import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'lib-robot-list',
  templateUrl: './robot-list.component.html',
  styleUrls: ['./robot-list.component.scss']
})
export class RobotListComponent {
  constructor(
    private http: HttpService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.getInfo();
  }
  exchangeList:any;
  isVisible = false;
  bot:'healing'|'handle'|'kline'='healing'; // (healing=跟盘,handle=盘口,kline=画线)

  modalInfo = {
    tokenA: '',
    tokenB: '',
    mark: 'lbank2', // 交易所mark
    target: 'mexc', // 目标交易所mark
    gear_count: '', // 维护档位数(盘口必填参数)
    limit_max: '', // 区间上限(画线必填参数)
    limit_min: '', // 区间下限(画线必填参数)
    mode: '标准', // 模式(跟盘必填参数)
    handle_difference: '', // 盘口差价(跟盘、画线、盘口必填参数)
    gear_difference: '', // 每档差价(跟盘、画线、盘口必填参数)
    buy_num: '', // 买盘每档数量(跟盘、画线、盘口必填参数)
    sell_num: '', // 卖盘每档数量(跟盘、画线、盘口必填参数)
    max_num: '', // 单次最大吃单(跟盘、画线必填参数)
    decimal: '', // 价格小数点位数(跟盘、画线、盘口必填参数)
    day_count: '', // 每日刷单总量(跟盘、画线必填参数)
  }
  showModal(type:'healing'|'handle'|'kline'='healing'): void {
    this.bot = type;
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  getInfo() {
    this.http.get('/exchange',{},{withToken:false}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.exchangeList = res.data;
    });
  }
  saveNewBot() {
    let reqObj;
    reqObj = {
      pairs: this.modalInfo.tokenA+'_'+this.modalInfo.tokenB,
      mark: this.modalInfo.mark,
      gear_count: this.modalInfo.gear_count,
      limit_max: this.modalInfo.limit_max,
      limit_min: this.modalInfo.limit_min,
      mode: this.modalInfo.mode,
      target: this.modalInfo.target,
      handle_difference: this.modalInfo.handle_difference,
      gear_difference: this.modalInfo.gear_difference,
      buy_num: this.modalInfo.buy_num,
      sell_num: this.modalInfo.sell_num,
      max_num: this.modalInfo.max_num,
      decimal: this.modalInfo.decimal,
      day_count: this.modalInfo.day_count,
      bot: this.bot,
    };
    this.http.post('/bot/add', reqObj,{withToken: true}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.isVisible = false;
      this.router.navigate(['/core/trade/robots']);
    })
  }
}
