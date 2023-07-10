import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environments';


type resType = {
  errno: number,
  errmsg: string,
  data: any,
  trace_id: string,
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private protocol = environment.httpProtocol;
  private host = environment.httpHost;
  private token: string | null = null;
  private getUrl(url: string) {
    let result = this.host + '/' + url;
    return this.protocol + '://' + result.replace(/\/+/g, '/');
  }
  public token_get() {
    this.token = window.localStorage.getItem('market_token');
    return this.token;
  }
  private token_set(token: string) {
    this.token = token;
    window.localStorage.setItem('market_token', token);
  }

  constructor(
    public client: HttpClient,
    private router: Router,
  ) {
    this.token_get();
  }

  get(url: string, data?: {[key: string]: string|number}|string, options?: { withToken?: boolean }) {
    let params = options?.withToken ? ('?token=' + this.token + '&') : '';
    if (data !== undefined && !params) params += '?';
    if (typeof data === 'object') {
      for (let key in data) {
        params += key + '=' + data[key] + '&';
      }
    } else if (data) {
      params += data;
    }
    return this.client.get<resType>(this.getUrl(url) + params).pipe(this.check_login);
  }

  post(url: string, data: any, options?: { withToken?: boolean }) {
    let body = new FormData();
    if (typeof data === 'object') {
      for (let key in data) {
        body.append(key, data[key]);
      }
    } else if (data instanceof FormData) {
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
      const sub = new Subject<resType>();
      res.subscribe(data => {
        if (data.errno === 200) {
          this.token_set(data.data);
        }
        sub.next(data);
      });
      return sub;
    });
  }

  private check_login = (res: Observable<resType>): Observable<resType> => {
    const sub = new Subject<resType>();
    res.subscribe(data => {
      if (data.errno === 20001) {
        window.localStorage.removeItem('market_token');
        this.router.navigate(['/auth/login']);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      sub.next(data);
    });
    return sub;
  }
}
