import { Component, OnInit, OnDestroy} from '@angular/core';
import {Message} from './message';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[MessagesService]
})

export class AppComponent implements OnInit, OnDestroy{
  private allMessages : Message[];
  private currentMessage : string = "";
  private userName : string = "Anonymous";
  private onlineUsers : string[]=[];
  private errorMessage: string;

  connection;

  constructor(private messagesService:MessagesService) {}

  newMessage(){
    let messageToSend : Message = {author:this.userName, text:this.currentMessage};
    this.messagesService.sendMessage(messageToSend);
    /*Clear*/
    this.currentMessage = "";
  }

  ngOnInit() {
    this.getMessagesHistory();
    this.getOnlineUsers();
    this.connection = this.messagesService.getMessages().subscribe(message => {
      this.allMessages.push(message);
    });
    this.connection = this.messagesService.getUsers().subscribe(user => {
      this.onlineUsers.push(user);
    });

  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  getMessagesHistory() {
  this.messagesService.getMessagesHistory()
                      .then(
                        messagesHistory => this.allMessages = messagesHistory,
                        error =>  this.errorMessage = <any>error);
  }
  getOnlineUsers() {
  this.messagesService.getOnlineUsers()
                      .then(
                        users => {this.onlineUsers = users;
                                  this.userName += this.onlineUsers.length;
                        },
                        error =>  this.errorMessage = <any>error);
  }
}
