import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'lib-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent {
  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {
    this.getInfo();
  }
  exchangeList:any;
  isVisible = false;
  showEdit = false;
  alarmList:any;
  isLoading:boolean=false;
  modalInfo = {
    tokenA: '',
    tokenB: '',
    exchange: 'lbank2', // 交易所mark
    max_price: '', // 价格高于
    min_price: '', // 价格低于
    min_token1: '', // 代币1余额低于
    min_token2: '', // 代币2余额低于
    price_change: '', // 价格突变幅度
  }
  chooseMark:number = 0;
  modalInfo1 = {
    tokenA: '',
    tokenB: '',
    max_price: '', // 价格高于
    min_price: '', // 价格低于
    min_token1: '', // 代币1余额低于
    min_token2: '', // 代币2余额低于
    price_change: '', // 价格突变幅度
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  showModal1(): void {
    this.showEdit = true;
  }
  handleCancel1(): void {
    this.showEdit = false;
  }
  submitStart() :void{
    this.isLoading = true;
    let reqObj;
    reqObj = {
      pairs: this.modalInfo.tokenA+'_'+this.modalInfo.tokenB,
      exchange: this.modalInfo.exchange,
      max_price: this.modalInfo.max_price,
      min_price: this.modalInfo.min_price,
      min_token1: this.modalInfo.min_token1,
      min_token2: this.modalInfo.min_token2,
      price_change: this.modalInfo.price_change,
    };
    this.http.post('/alarm/add', reqObj,{withToken: true}).subscribe(res => {
      setTimeout(()=> {
        this.isLoading = false;
      },300)
      this.isVisible = false;
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.getInfo();
    })
  }
  getInfo() {
    this.http.get('/exchange',{},{withToken:false}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.exchangeList = res.data;
    });

    this.http.get('/alarm/list','',{withToken:true}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.alarmList = res.data;
    });
  }
  changeState(state:boolean,mark:number) {
    this.isLoading = true;
    let url = ''
    if (state) {
      url = '/alarm/close'
    } else {
      url = '/alarm/start'
    }
    this.http.post(url, {alarm: mark},{withToken: true}).subscribe(res => {
      setTimeout(()=> {
        this.isLoading = false;
      },300)
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.getInfo();
    })
  }
  deleteConfirm(mark:number): void {
    this.modal.create({
      nzTitle: '删除提示',
      nzContent: '确定删除该机器人吗',
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => {
        this.isLoading = true;
        this.http.post('/alarm/del', {alarm: mark},{withToken: true}).subscribe(res => {
          setTimeout(()=> {
            this.isLoading = false;
          },300)
          if (res.errno !== 200) {
            this.message.error(res.errmsg);
            return;
          }
          this.getInfo();
        })
      }
    });
  }
  editRobot(item:any) {
    let configArr = item.config.split(',');
    this.modalInfo1.min_price = configArr[0];
    this.modalInfo1.max_price = configArr[1];
    this.modalInfo1.tokenA = configArr[2];
    this.modalInfo1.min_token1 = configArr[3];
    this.modalInfo1.tokenB = configArr[4];
    this.modalInfo1.min_token2 = configArr[5];
    this.modalInfo1.price_change = configArr[6];
    this.chooseMark = item.mark;
    this.showModal1();
  }
  submitEdit() {
    this.isLoading = true;
    let reqObj = {
      alarm: this.chooseMark,
      config: this.modalInfo1.min_price+','+
      this.modalInfo1.max_price+','+
      this.modalInfo1.tokenA+','+
      this.modalInfo1.min_token1+','+
      this.modalInfo1.tokenB+','+
      this.modalInfo1.min_token2+','+
      this.modalInfo1.price_change
    }
    this.http.post('/alarm/edit', reqObj,{withToken: true}).subscribe(res => {
      this.showEdit = false;
      setTimeout(()=> {
        this.isLoading = false;
      },300)
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.getInfo();
    })
  }
}
