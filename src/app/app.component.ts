import { Component } from '@angular/core';
import {Message} from './message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'It will be magnificent soon!';
  private allMessages : Message[] = [{author:"yolo", text:"swagg"}];
  private currentMessage : string = "";
  private userName : string = "Change Me";
  private onlineUsers : string[];

  newMessage(){
    let messageToSend : Message = {author:this.userName, text:this.currentMessage};
    this.allMessages.push(messageToSend);

    /*Clear*/
    this.currentMessage = "";
  }
}
