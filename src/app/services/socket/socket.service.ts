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
    if (this.mark === mark) return;
    this.mark = mark;
    this.setSocketClient(mark);
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
    this.markSocketClient?.next(message);
  }

}
