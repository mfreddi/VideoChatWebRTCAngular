import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket = io('https://fred-sample-video-chat.herokuapp.com/', {reconnection: true});
  constructor() { }

  public connect(): void {
    this.socket.on('disconnect', (data) => {
      // Received disconnect from Websocket Server
    });
  }
  public updateUserList(): Observable<Array<string>> {// users
    return new Observable(observe => {
      this.socket.on('update-user-list', ({users}) => {
        observe.next(users);
      });
    });
  }
  public removeUser(): Observable<string> {// user
    return new Observable(observe => {
      this.socket.on('remove-user', ({socketId}) => {
        observe.next(socketId);
      });
    });
  }
  public on(key: string) {
    return new Observable(observe => {
      this.socket.on(key, (data) => {
        // Received ${key} from Websocket Server
        observe.next(data);
      });
    });
  }
  public sendMessage(key, message): void {
    this.socket.emit(key, message);
  }
  public disconect(): void {
    this.socket.disconnect();
    location.reload();
  }
}
