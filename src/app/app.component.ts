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
  private allMessages : {}[];
  private currentMessage : string = "";
  private userName : string = "Anonymous";
  private onlineUsers : string[];
  private errorMessage: string;

  connection;

  constructor(private messagesService:MessagesService) {}

  newMessage(){
    let messageToSend : Message = {author:this.userName, text:this.currentMessage};
    this.messagesService.sendMessage(messageToSend);
    this.allMessages.push(messageToSend);
    /*Clear*/
    this.currentMessage = "";
  }

  ngOnInit() {
    this.getMessagesHistory();
    this.connection = this.messagesService.getMessages().subscribe(message => {
      this.allMessages.push(message);
    })
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
}
