import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { Message } from './message';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MessagesService {
  private url = 'http://localhost:3000';
  private socket;
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  constructor(private http: Http) {
    this.socket = io(this.url);
  }

  sendMessage(message: Message) {
    this.socket.emit('new message', message);
  }

  getMessagesHistory(): Promise<Message[]> {
  return this.http.get('/messages')
            .toPromise()
            .then(response => response.json() as Message[])
            .catch(this.handleError);
  }

  getMessages() {
    let observable = new Observable<Message>(observer => {
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
