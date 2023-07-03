import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/services/http/http.service';
import { shaStr } from 'src/app/tools/string';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  validateForm!: UntypedFormGroup;
  isLoading = false;

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpService,
    private message: NzMessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      agree: [true]
    });
  }

  checkForm(): void {
    if (this.isLoading) return;
    if (this.validateForm.valid) {
      this.submitForm();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitForm(): void {
    this.isLoading = true;
    this.http.login(this.validateForm.value.userName, shaStr(this.validateForm.value.password)).subscribe(res => {
      this.isLoading = false;
      if (res.errno === 200) {
        this.message.success('登录成功');
        this.router.navigate(['/core/trade/stocks']);
      } else {
        this.message.error(res.errmsg);
      }
    })
  }
}
