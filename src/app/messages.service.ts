import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {Message} from './message';
@Injectable()
export class MessagesService {
  private url = 'http://localhost:3000';
    private socket;


    constructor() { }
    sendMessage(message: Message){
      this.socket.emit('new message', message);
    }

    getMessages() {
      let observable = new Observable(observer => {
        this.socket = io(this.url);
        this.socket.on('new message', (data: Message) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      })
      return observable;
    }
}
