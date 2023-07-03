import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


type resType = {
  errno: number,
  errmsg: string,
  data: string,
  trace_id: string,
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private protocol = 'http';
  private host = '192.168.3.174:8553';
  private token: string | null = null;
  private getUrl(url: string) {
    let result = this.host + '/' + url;
    return this.protocol + '://' + result.replace(/\/+/g, '/');
  }
  private token_get() {
    this.token = window.localStorage.getItem('market_token');
  }
  private token_set(token: string) {
    window.localStorage.setItem('market_token', token);
  }

  constructor(
    public client: HttpClient,
    private router: Router,
  ) {
    this.token_get();
  }

  get(url: string, options?: { withToken?: boolean }) {
    return this.client.get(this.getUrl(url));
  }

  post(url: string, data: any, options?: { withToken?: boolean }) {
    let body = new FormData();
    if (typeof data === 'object') {
      for (let key in data) {
        body.append(key, data[key]);
      }
    } else {
      body = data;
    }
    if (options?.withToken) body.append('token', this.token||'');
    return this.client.post<resType>(this.getUrl(url), body).pipe(this.check_login);
  }

  login(account: string, password: string) {
    return this.post('login/login', {
      account: account,
      pass: password,
    }).pipe(res => {
      res.subscribe(data => {
        if (data.errno === 200) {
          this.token_set(data.data);
        }
      });
      return res;
    });
  }

  private check_login(res: Observable<resType>): Observable<resType> {
    res.subscribe(data => {
      if (data.errno === 20001) {
        window.localStorage.removeItem('market_token');
        this.router.navigate(['/auth/login']);
        window.location.reload();
      }
    });
    return res;
  }
}
