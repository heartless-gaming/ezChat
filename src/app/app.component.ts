import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Message } from './message';
import { User } from './user';
import { MessagesService } from './messages.service';
import { UserService } from './user.service';
import { EmojiService } from './emoji/emoji.service';
import * as io from 'socket.io-client';
declare var Materialize : any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessagesService, UserService, EmojiService]
})

export class AppComponent implements OnInit, OnDestroy{
  private allMessages : Message[];
  private currentMessage : string = "";
  private userName : string = "Anonymous";
  private onlineUsers : string[]=[];
  private errorMessage: string;

  private emojis : string[] = [];
  private focus : boolean = false;
  private unreadMessageNumber : number = 0;

  private usersTyping : string[] = [];
  private userIsTyping : boolean  = false;
  connection;

  constructor(private messagesService:MessagesService, private userService:UserService, private emojiService:EmojiService, private title: Title) {}

  newMessage() {
    if(this.currentMessage != "" && this.userName != ""){
      let messageToSend : Message = {author:this.userName, text:this.currentMessage, img: null, youtube: null};
      this.messagesService.sendMessage(messageToSend);
      // Clear
      this.currentMessage = "";
    }
    else{
      Materialize.toast("You can't send empty message or you have an empty username", 4000)
    }
  }

  ngOnInit() {
    // talk to the server to get a username that is not already used
    this.getEmojis();
    this.userService.getAvailableUsername();
    this.userService.getOnlineUsers()
                    .then(
                      users => {
                        this.onlineUsers = users;
                        this.userName += this.onlineUsers.length + 1;
                      },
                      error =>  this.errorMessage = <any>error);
    this.getMessagesHistory(); // Load the previous message from the server.
    this.connection = this.messagesService.getMessages().subscribe(message => {
      this.allMessages.push(message);
      if(!this.focus){
        this.unreadMessageNumber++;
        this.title.setTitle('('+this.unreadMessageNumber+')'+' EzChat');
      }
    });
    this.connection = this.userService.getUsers().subscribe(users => {
      this.onlineUsers = users;
    });
    this.connection = this.userService.someoneIsTyping().subscribe(user => {
      this.usersTyping.push(user);
    });
    this.connection = this.userService.someoneStopTyping().subscribe(user => {
      var index = this.usersTyping.indexOf(user);    // <-- Not supported in <IE9
        if (index !== -1) {
          this.usersTyping.splice(index, 1);
        }
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

  changeUsername(){
    this.userService.changeUsername(this.userName);
  }
  getEmojis(){
      this.emojiService.getEmojis()
                          .then(
                            emojis => this.emojis = emojis,
                            error =>  this.errorMessage = <any>error);
  }
  setOutFocus(){
    this.focus = false;
  }
  setInFocus(){
    this.focus = true;
    this.title.setTitle('EzChat');
    this.unreadMessageNumber=0;
  }
  isTyping(){
      if(!this.userIsTyping){
        this.userService.isTyping(this.userName);
        this.userIsTyping = true;
        setTimeout(() => {
          this.userService.stopTyping(this.userName);
          this.userIsTyping = false;
        }
        , 2000);
      }
  }
}
