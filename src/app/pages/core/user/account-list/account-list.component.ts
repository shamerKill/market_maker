import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { zip } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'lib-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  accountList: {
    name: string;
    accountID: string;
    exchange: string;
    APIKey: string;
    APISecret: string;
  }[] = [];
  isInitLoading = true;
  exchangeList: {name: string, mark: string, logo: string}[] = [];
  email = '';
  ips: string[] = [];
  codeWaitTime = 0;

  createIsVisible = false;
  createLoading = false;
  createModalValue = {
    name: '',
    exchange: '',
    APIKey: '',
    APISecret: '',
    code: '',
  };

  editIsVisible = false;
  editModalValue = {
    accountId: '',
    exchange: '',
    APIKey: '',
    APISecret: '',
    name: '',
  };


  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.getExchangeList();
  }

  private getAccountList(): void {
    this.http.get('/account/list', undefined, {withToken: true}).subscribe(res => {
      this.isInitLoading = false;
      if (res.errno=== 200) {
        if (res.data && res.data.length) {
          this.accountList = res.data.map((item: any) => {
            return {
              name: item.name,
              accountID: item.account_id,
              exchange: this.exchangeList.find(exchange => exchange.mark === item.exchange)?.name||'',
              APIKey: item.key,
              APISecret: '*********',
            };
          });
        }
      }
    })
  }

  // 创建
  onCreateAccount() {
    if (this.createLoading) return;
    if (!this.createModalValue.name) {
      this.message.error('请输入账户名称');
      return;
    }
    if (!this.createModalValue.exchange) {
      this.message.error('请选择交易所');
      return;
    }
    if (!this.createModalValue.APIKey) {
      this.message.error('请输入API Key');
      return;
    }
    if (!this.createModalValue.APISecret) {
      this.message.error('请输入API Secret');
      return;
    }
    if (!this.createModalValue.code) {
      this.message.error('请输入验证码');
      return;
    }
    this.createLoading = true;
    this.http.post('account/add', {
      mark: this.createModalValue.exchange,
      name: this.createModalValue.name,
      key: this.createModalValue.APIKey,
      secret: this.createModalValue.APISecret,
      code: this.createModalValue.code,
    }, {withToken: true}).subscribe(res => {
      this.createLoading = false;
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.message.success('创建成功');
      this.createIsVisible = false;
      this.accountList.push({
        name: this.createModalValue.name,
        accountID: res.data.accountID,
        exchange: this.exchangeList.find(item => item.mark === this.createModalValue.exchange)?.name||'',
        APIKey: this.createModalValue.APIKey,
        APISecret: this.createModalValue.APISecret,
      });
      this.createModalValue.name = '';
      this.createModalValue.APIKey = '';
      this.createModalValue.APISecret = '';
      this.createModalValue.code = '';
      this.createModalValue.exchange = '';
    });
  }

  onToggleEdit(type: boolean, id?: string) {
    this.editIsVisible = type;
    if (id) {
      const item = this.accountList.find(item => item.accountID === id);
      if (item) {
        this.editModalValue.accountId = id;
        this.editModalValue.APIKey = item.APIKey;
        this.editModalValue.name = item.name;
        this.editModalValue.APISecret = item.APISecret;
        this.editModalValue.exchange = item.exchange;
      }
    } else {
      this.editModalValue.accountId = '';
      this.editModalValue.APIKey = '';
      this.editModalValue.name = '';
      this.editModalValue.APISecret = '';
      this.editModalValue.exchange = '';
    }
  }
  // 修改
  onEdit() {
    const oldItem = this.accountList.find(item => item.accountID === this.editModalValue.accountId);
    if (!oldItem) return;
    if (this.editModalValue.name === oldItem.name) return;
    const confirm = this.modal.confirm({
      nzTitle: '是否修改名称?',
      nzOnOk: () => {
        confirm.updateConfig({
          nzOkLoading: true,
        });
        this.http.post('/account/edit', {
          account_id: this.editModalValue.accountId,
          name: this.editModalValue.name,
        }, {withToken: true}).subscribe(res => {
          if (res.errno === 200) {
            this.message.success('修改成功');
            oldItem.name = this.editModalValue.name;
            confirm.destroy();
            this.onToggleEdit(false);
          } else {
            this.message.error(res.errmsg);
            confirm.updateConfig({
              nzOkLoading: false,
            });
          }
        });
        return false;
      }
    });
  }

  // 删除
  onDelete(id: string) {
    const oldItem = this.accountList.find(item => item.accountID === id);
    if (!oldItem) return;
    const confirm = this.modal.confirm({
      nzTitle: '是否删除 ' + oldItem.name + ' ?',
      nzOnOk: () => {
        confirm.updateConfig({
          nzOkLoading: true,
        });
        this.http.post('/account/del', {
          account_id: id,
        }, {withToken: true}).subscribe(res => {
          if (res.errno === 200) {
            this.accountList = this.accountList.filter(item => item.accountID !== id);
            this.message.success('删除成功');
            confirm.destroy();
          } else {
            this.message.error(res.errmsg);
            confirm.updateConfig({
              nzOkLoading: false,
            });
          }
        });
        return false;
      }
    });
  }

  // 获取验证码
  getCaptcha(): void {
    if (this.codeWaitTime !== 0) return;
    this.codeWaitTime = 60;
    this.http.post('/account/code', {}, { withToken: true }).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        this.codeWaitTime = 0;
        return;
      }
      this.message.success('发送成功');
      let timer = setInterval(() => {
        this.codeWaitTime--;
        if (this.codeWaitTime <= 0) {
          clearInterval(timer);
          this.codeWaitTime = 0;
        }
      }, 1000);
    });
  }

  // 获取交易所列表
  getExchangeList() {
    this.http.get('/exchange').subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.exchangeList = res.data;
      this.getAccountInfo();
    });
  }
  // 获取账户信息
  getAccountInfo() {
    this.http.get('/account/info', undefined, { withToken: true }).subscribe(res => {
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      if (res.data.email) this.email = res.data.email;
      if (res.data.ip) this.ips = res.data.ip;
      this.getAccountList();
    })
  }
}
