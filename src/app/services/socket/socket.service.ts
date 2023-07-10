import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpService } from '../http/http.service';
import { environment } from 'src/environments/environments';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socketUrl = 'ws://' + environment.httpHost + '/order/list';
  private token: string | null = null;
  private mark: string | null = null;

  private socketClient: Subject<any> = new Subject();
  private markSocketClient: WebSocketSubject<any> | null = null;


  private setSocketClient(mark: string) {
    if (!mark) return;
    if (this.markSocketClient) {
      this.markSocketClient.unsubscribe();
      this.markSocketClient = null;
    }
    this.token = this.http.token_get();
    this.markSocketClient = webSocket(
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
    this.markSocketClient.subscribe(res => {
      this.getSocketClient().next(res);
    });
  }

  public getSocketClient(): Subject<any> {
    return this.socketClient;
  }

  public setMark(mark: string) {
    this.mark = mark;
    this.setSocketClient(mark);
  }
  public stopClient() {
    this.markSocketClient?.unsubscribe();
    this.markSocketClient = null;
  }

  private setTimePing() {
    this.sendMessage('ping');
  }

  constructor(
    private http: HttpService,
  ) {
    this.socketClient.subscribe(res => {
      if (res === 'pong') {
        setTimeout(() => {
          this.setTimePing();
        }, 10000);
      }
    });
  }

  sendMessage(message: any) {
    this.markSocketClient?.next(message);
  }

}
