import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'lib-robot-logs',
  templateUrl: './robot-logs.component.html',
  styleUrls: ['./robot-logs.component.scss']
})
export class RobotLogsComponent {
  constructor(
    private http: HttpService,
    private message: NzMessageService,
  ) {
    this.getInfo();
  }
  exchangeList:any;
  logList:any;
  dateArr:Date[] = [];
  exchangeMark = '';
  tokenA:string='';
  tokenB:string='';
  keyInfo:string = '';
  pageIndex:number=1;
  pageSize:number=10;
  total:number=0;
  getInfo() {
    this.http.get('/exchange',{},{withToken:false}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.exchangeList = res.data;
    });
    this.getList()
  }
  getList() {
    let date = '';
    let pairs = '';
    if (this.dateArr.length > 0) {
      date = Math.trunc(Number(this.dateArr[0])/1000)+','+Math.trunc(Number(this.dateArr[1])/1000)
    }
    if (this.tokenA&&this.tokenB) {
      pairs = this.tokenA+'_'+this.tokenB
    }
    this.http.get('/logs/info',{
      mark:this.exchangeMark??'',
      pairs:pairs,
      date:date,
      info:this.keyInfo,
      from:this.pageIndex,
      amount:this.pageSize
    },{withToken:true}).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.total = res.data.total;
      if (res.data.Data != null) {
        this.logList = res.data.Data;
      } else {
        this.logList = [];
      }
    });
  }
  getSizeChange(result:number) {
    this.pageIndex = 1;
    this.pageSize = result;
    this.getList();
  }
  getIndexChange(result:number) {
    this.pageIndex = result;
    this.getList();
  }
}
