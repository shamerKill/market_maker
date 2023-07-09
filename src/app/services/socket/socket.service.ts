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
      this.socketClient = webSocket(
        {
          url: this.socketUrl + '?token=' + this.token + '&mark=' + this.mark,
          deserializer: (e) => {
            try {
              return JSON.parse(e.data);
            } catch {
              return {type: 'text', msg: e.data};
            }
          }
        }
      );
      this.setTimePing();
    }
    return this.socketClient;
  }

  private setTimePing() {
    this.sendMessage('ping');
    setTimeout(() => {
      this.setTimePing();
    }, 10000);
  }

  constructor(
    private http: HttpService,
  ) { }

  sendMessage(message: any) {
    this.getSocketClient().next(message);
  }

  addListener<T=any>(key: any) {}
}
