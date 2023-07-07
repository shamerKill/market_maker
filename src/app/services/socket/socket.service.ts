import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socketUrl = 'ws://192.168.3.174:8553/order/list';
  private token: string | null = null;
  private mark: string | null = 'mexc';

  private socketClient?: WebSocketSubject<any>;

  public getSocketClient(): WebSocketSubject<any> {
    this.token = this.http.token_get();
    if (!this.socketClient) {
      this.socketClient = webSocket(this.socketUrl + '&token=' + this.token + '&mark=' + this.mark);
    }
    return this.socketClient;
  }

  constructor(
    private http: HttpService,
  ) { }

  sendMessage(message: any) {
  }

  addListener<T=any>(key: any) {}
}
