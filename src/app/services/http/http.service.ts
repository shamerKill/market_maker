import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    public client: HttpClient,
  ) { }

  get(url: string) {
    return this.client.get(url);
  }

  post(url: string, data: any) {
    return this.client.post(url, data);
  }



}
