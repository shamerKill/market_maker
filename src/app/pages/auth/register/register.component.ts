import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/services/http/http.service';
import { shaStr } from 'src/app/tools/string';

@Component({
  selector: 'lib-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  validateForm!: UntypedFormGroup;
  codeWaitTime = 0;
  isLoading = false;


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    public http: HttpService,
    public message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      captcha: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      rePassword: [null, [Validators.required, this.confirmationValidator]],
      agree: [true],
    });
  }
  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.value.password) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
    if (this.codeWaitTime !== 0) return;
    if (this.validateForm.controls['email'].invalid) {
      this.validateForm.controls['email'].markAsDirty();
      this.validateForm.controls['email'].updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.codeWaitTime = 60;
    this.http.post('/login/code', {
      email: this.validateForm.value.email,
      type: 1
    }).subscribe(res => {
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
  checkForm(): void {
    if (this.isLoading) return;
    if (this.validateForm.valid) {
      if (!this.validateForm.value.agree) {
        this.message.error('请同意用户协议');
        return;
      }
      this.postData();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  postData() {
    this.isLoading = true;
    this.http.post('/login/register', {
      email: this.validateForm.value.email,
      code: this.validateForm.value.captcha,
      pass: shaStr(this.validateForm.value.password),
      repass: shaStr(this.validateForm.value.rePassword),
    }).subscribe(res => {
      this.isLoading = false;
      if (res.errno !== 200) {
        this.message.error(res.errmsg);
        return;
      }
      this.message.success('注册成功');
      this.router.navigate(['/auth/login']);
    });
  }
}
