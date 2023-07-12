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
  robotList:{ name: string; coin: any[]; }[]=[];
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
  exchangeList:any;
  chooseMark:number = 0;
  chooseType:number = 0;
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
    this.chooseMark = editRobot.mark;
    this.chooseType = editRobot.type;
    if (editRobot.type==1) {
      this.modalInfo1.buy_num = configArr[0];
      this.modalInfo1.sell_num = configArr[1];
      this.modalInfo1.handle_difference = configArr[2];
      this.modalInfo1.gear_difference = configArr[3];
      this.modalInfo1.decimal = configArr[4];
      this.modalInfo1.gear_count = configArr[5];
      this.showModal1();
    } else if (editRobot.type==2) {
      this.modalInfo2.limit_max = configArr[0];
      this.modalInfo2.limit_min = configArr[1];
      this.modalInfo2.handle_difference = configArr[2];
      this.modalInfo2.gear_difference = configArr[3];
      this.modalInfo2.buy_num = configArr[4];
      this.modalInfo2.sell_num = configArr[5];
      this.modalInfo2.max_num = configArr[6];
      this.modalInfo2.decimal = configArr[7];
      this.modalInfo2.day_count = configArr[8];
      this.showModal2();
    } else if (editRobot.type==3) {
      this.modalInfo3.mode = configArr[0];
      this.modalInfo3.target = configArr[1];
      this.modalInfo3.handle_difference = configArr[2];
      this.modalInfo3.gear_difference = configArr[3];
      this.modalInfo3.buy_num = configArr[4];
      this.modalInfo3.sell_num = configArr[5];
      this.modalInfo3.max_num = configArr[6];
      this.modalInfo3.decimal = configArr[7];
      this.modalInfo3.day_count = configArr[8];
      this.showModal3();
    }
  }
  submitEdit() {
    this.isLoading = true;
    let reqObj = {
      mark: this.chooseMark,
      config: ''
    }
    if (this.chooseType==1) {
      reqObj.config = this.modalInfo1.buy_num+','+
      this.modalInfo1.sell_num+','+
      this.modalInfo1.handle_difference+','+
      this.modalInfo1.gear_difference+','+
      this.modalInfo1.decimal+','+
      this.modalInfo1.gear_count
    } else if (this.chooseType==2) {
      reqObj.config = this.modalInfo2.limit_max+','+
      this.modalInfo2.limit_min+','+
      this.modalInfo2.handle_difference+','+
      this.modalInfo2.gear_difference+','+
      this.modalInfo2.buy_num+','+
      this.modalInfo2.sell_num+','+
      this.modalInfo2.max_num+','+
      this.modalInfo2.decimal+','+
      this.modalInfo2.day_count
    } else if (this.chooseType==3) {
      reqObj.config = this.modalInfo3.mode+','+
      this.modalInfo3.target+','+
      this.modalInfo3.handle_difference+','+
      this.modalInfo3.gear_difference+','+
      this.modalInfo3.buy_num+','+
      this.modalInfo3.sell_num+','+
      this.modalInfo3.max_num+','+
      this.modalInfo3.decimal+','+
      this.modalInfo3.day_count
    }
    this.http.post('/bot/edit', reqObj,{withToken: true}).subscribe(res => {
      if (this.chooseType==1) {
        this.handleCancel1();
      } else if (this.chooseType==2) {
        this.handleCancel2();
      } else if (this.chooseType==3) {
        this.handleCancel3();
      }
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
      }
      this.robotList = resList;
    });
    this.http.get('/exchange',{},{withToken:false}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.exchangeList = res.data;
    });
  }
  checked = false;
  list = [];
  updateAllChecked() {
    this.isLoading = true;
    this.http.get('/bot/list','',{withToken:true}).subscribe(res => {
      this.isLoading = false;
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      let resList = [];
      if (res.data.length>0) {
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
            let robotArr = [];
            for (let k = 0; k < res.data[key][i].length; k++) {
              if (this.checked&&res.data[key][i][k].state) {
                robotArr.push(res.data[key][i][k])
              }
              if (!this.checked) {
                robotArr.push(res.data[key][i][k])
              }
            }
            robotItem.robot = robotArr;
            itemObj.coin.push(robotItem)
          }
          resList.push(itemObj)
        }
      }
      this.robotList = resList;
    });
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
