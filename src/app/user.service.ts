import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  private url = 'http://localhost:3000';
  private socket;
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  constructor(private http: Http) {
    this.socket = io(this.url);
  }

  getOnlineUsers(): Promise<string[]>{
  return this.http.get(this.url+'/users')
            .toPromise()
            .then(response => response.json().users as string[])
            .catch(this.handleError);
  }
  // Listen to the users who joined eZchat
  getUsers() {
    let observable = new Observable<string>(observer => {
      this.socket.on('user joined', (data: string) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
  // talk to the server to get a username that is not already used
  getAvailableUsername() {
    this.socket.emit('add user')
  }
}
