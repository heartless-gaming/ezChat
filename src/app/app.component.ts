import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from './message';
import { User } from './user';
import { MessagesService } from './messages.service';
import { UserService } from './user.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessagesService, UserService]
})

export class AppComponent implements OnInit, OnDestroy{
  private allMessages : Message[];
  private currentMessage : string = "";
  private userName : string = "Anonymous";
  private onlineUsers : string[]=[];
  private errorMessage: string;

  connection;

  constructor(private messagesService:MessagesService, private userService:UserService) {}

  newMessage() {
    let messageToSend : Message = {author:this.userName, text:this.currentMessage, img: null, youtube: null};
    this.messagesService.sendMessage(messageToSend);
    // Clear
    this.currentMessage = "";
  }

  ngOnInit() {
    this.getMessagesHistory();
    this.userService.getOnlineUsers()
      .then(
          data => console.log(data)
      );
    this.connection = this.messagesService.getMessages().subscribe(message => {
      console.log(message);
      this.allMessages.push(message);
    });
    this.connection = this.userService.getUsers().subscribe(user => {
      this.onlineUsers.push(user);
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  getMessagesHistory() {
      this.userService.getOnlineUsers()
                      .then(
                        users => {
                          this.onlineUsers = users;
                          this.userName += this.onlineUsers.length + 1;
                        },
                        error =>  this.errorMessage = <any>error);
    this.messagesService.getMessagesHistory()
                        .then(
                          messagesHistory => this.allMessages = messagesHistory,
                          error =>  this.errorMessage = <any>error);
  }
}
