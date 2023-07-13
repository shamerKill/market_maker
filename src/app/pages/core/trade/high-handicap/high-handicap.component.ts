import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { filter } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { SocketService } from 'src/app/services/socket/socket.service';


type highInfoType = {
  id: number,
  willDidTokenType: string,
  willDidTokenNumber: string,
  otherUserNumber: string,
  myNumber: string,
  allNumber: string,
  price: string,
};

@Component({
  selector: 'lib-high-handicap',
  templateUrl: './high-handicap.component.html',
  styleUrls: ['./high-handicap.component.scss']
})
export class HighHandicapComponent implements OnInit {
  symbol?: string;
  mark?: string;


  buyToken: string = '';
  buyInfoList: highInfoType[] = [
  ];
  sellToken: string = '';
  sellInfoList: highInfoType[] = [
  ];

  constructor(
    private route: ActivatedRoute,
    private socket: SocketService,
    private modal: NzModalService,
    private http: HttpService,
    private message: NzMessageService,
    public location: Location,
  ) {
    this.route.params.subscribe(res => {
      this.mark = res['mark'];
      this.symbol = res['symbol'];
      this.sellToken = this.symbol?.split('_')[0] || '';
      this.buyToken = this.symbol?.split('_')[1] || '';
      this.socket.setMark(this.mark || '');
    });
    this.socket.getSocketClient().pipe(filter(item => {
      return item.type === 'seniorHandle';
    })).subscribe(res => {
      if (res.data) {
        if (res.data.Bids) this.buyInfoList = res.data.Bids.map((item: any) => {
          return {
            id: item.price,
            willDidTokenType: this.buyToken,
            willDidTokenNumber: item.slap,
            otherUserNumber: item.retail,
            myNumber: item.my,
            allNumber: item.amount,
            price: item.price,
          };
        });
        if (res.data.Asks) this.sellInfoList = res.data.Asks.map((item: any) => {
          return {
            id: item.price,
            willDidTokenType: this.buyToken,
            willDidTokenNumber: item.slap,
            otherUserNumber: item.retail,
            myNumber: item.my,
            allNumber: item.amount,
            price: item.price,
          };
        })
      }
    });
    this.socket.sendMessage(
      {"symbol": this.symbol,"timeframe":"1m"}
    );
    this.socket.sendMessage('seniorHandle');
  }

  ngOnInit(): void {
  }


  // 拉盘/砸盘操作
  handleHighHandicap(type: 'buy'|'sell', item: highInfoType) {
    console.log('handleHighHandicap', type);
    const confirm = this.modal.confirm({
      nzTitle: '确认操作',
      nzContent: `
        确认
        ${type === 'buy' ? '拉盘' : '砸盘'}至
        ${item.price} ${this.buyToken}/${this.sellToken}
        吗？`,
      nzOnOk: () => {
        confirm.updateConfig({nzOkLoading: true});
        this.http.post('/handle/control_price', {
          pairs: this.symbol,
          mark: this.mark,
          price: item.price,
          side: type,
        }, {withToken: true}).subscribe(res => {
          confirm.updateConfig({nzOkLoading: false});
          if (res.errno === 200) {
            this.message.success('已执行，执行结果请去日志中查看');
          } else {
            this.modal.error({
              nzTitle: '操作失败',
              nzContent: res.errmsg,
            });
          }
          confirm.close();
        });
        return false;
      }
    });
  }

}
