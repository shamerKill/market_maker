import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'lib-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.scss']
})
export class RobotsComponent {
  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {
    this.getInfo();
  }
  robotList:any;
  isLoading:boolean=false;
  modalInfo1 = {
    buy_num: '', // 买盘每档数量(跟盘、画线、盘口必填参数)
    sell_num: '', // 卖盘每档数量(跟盘、画线、盘口必填参数)
    handle_difference: '', // 盘口差价(跟盘、画线、盘口必填参数)
    gear_difference: '', // 每档差价(跟盘、画线、盘口必填参数)
    decimal: '', // 价格小数点位数(跟盘、画线、盘口必填参数)
    gear_count: '', // 维护档位数(盘口必填参数)
  }
  modalInfo2 = {
    limit_max: '', // 区间上限(画线必填参数)
    limit_min: '', // 区间下限(画线必填参数)
    handle_difference: '', // 盘口差价(跟盘、画线、盘口必填参数)
    gear_difference: '', // 每档差价(跟盘、画线、盘口必填参数)
    buy_num: '', // 买盘每档数量(跟盘、画线、盘口必填参数)
    sell_num: '', // 卖盘每档数量(跟盘、画线、盘口必填参数)
    max_num: '', // 单次最大吃单(跟盘、画线必填参数)
    decimal: '', // 价格小数点位数(跟盘、画线、盘口必填参数)
    day_count: '', // 每日刷单总量(跟盘、画线必填参数)
  }
  modalInfo3 = {
    mode: '标准', // 模式(跟盘必填参数)
    target: '', // 目标盘口(跟盘必填参数)
    handle_difference: '', // 盘口差价(跟盘、画线、盘口必填参数)
    gear_difference: '', // 每档差价(跟盘、画线、盘口必填参数)
    buy_num: '', // 买盘每档数量(跟盘、画线、盘口必填参数)
    sell_num: '', // 卖盘每档数量(跟盘、画线、盘口必填参数)
    max_num: '', // 单次最大吃单(跟盘、画线必填参数)
    decimal: '', // 价格小数点位数(跟盘、画线、盘口必填参数)
    day_count: '', // 每日刷单总量(跟盘、画线必填参数)
  }
  isVisible1:boolean= false;
  showModal1(): void {
    this.isVisible1 = true;
  }
  handleCancel1(): void {
    this.isVisible1 = false;
  }
  isVisible2:boolean= false;
  showModal2(): void {
    this.isVisible2 = true;
  }
  handleCancel2(): void {
    this.isVisible2 = false;
  }
  isVisible3:boolean= false;
  showModal3(): void {
    this.isVisible3 = true;
  }
  handleCancel3(): void {
    this.isVisible3 = false;
  }
  editRobot(editRobot:any) {
    let configArr = editRobot.config.split(',')
    if (editRobot.type==1) {
      this.modalInfo1.buy_num = configArr[0];
      this.modalInfo1.sell_num = configArr[1];
      this.modalInfo1.handle_difference = configArr[2];
      this.modalInfo1.gear_difference = configArr[3];
      this.modalInfo1.decimal = configArr[4];
      this.modalInfo1.gear_count = configArr[5];
      this.showModal1();
    } else if (editRobot.type==2) {
      this.modalInfo1.buy_num = configArr[0];
      this.modalInfo1.sell_num = configArr[1];
      this.modalInfo1.handle_difference = configArr[2];
      this.modalInfo1.gear_difference = configArr[3];
      this.modalInfo1.decimal = configArr[4];
      this.modalInfo1.gear_count = configArr[5];
      this.showModal2();
    } else if (editRobot.type==3) {
      this.modalInfo1.buy_num = configArr[0];
      this.modalInfo1.sell_num = configArr[1];
      this.modalInfo1.handle_difference = configArr[2];
      this.modalInfo1.gear_difference = configArr[3];
      this.modalInfo1.decimal = configArr[4];
      this.modalInfo1.gear_count = configArr[5];
      this.showModal2();
    }
  }
  getInfo() {
    this.http.get('/bot/list','',{withToken:true}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      let resList = [];
      if (res.data) {
        for (let key in res.data) {
          let itemObj:{name:string,coin:any[]} = {
            name: '',
            coin: []
          }
          itemObj.name = key;
          for (let i in res.data[key]) {
            let robotItem:{name:string,robot:any[]} = {
              name: '',
              robot: []
            }
            robotItem.name = i;
            robotItem.robot = res.data[key][i];
            itemObj.coin.push(robotItem)
          }
          resList.push(itemObj)
        }
        this.robotList = resList;
      }
    });
  }
  checked = false;
  list = [];
  updateAllChecked() {
    console.log(this.checked)
    this.list = this.list.filter((item:any) => item.state);
  }
  changeState(state:boolean,mark:number) {
    this.isLoading = true;
    let url = ''
    if (state) {
      url = '/bot/close'
    } else {
      url = '/bot/start'
    }
    this.http.post(url, {mark: mark},{withToken: true}).subscribe(res => {
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
        this.http.post('/bot/del', {mark: mark},{withToken: true}).subscribe(res => {
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
}
