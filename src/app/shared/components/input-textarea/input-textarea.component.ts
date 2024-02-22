import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChannelMessage } from '../../models/channel-message.class';
import { DataService } from '../../services/data.service';
import { ChannelMessagesService } from '../../firebase-services/channel-message.service';
import { Channel } from '../../models/channel.class';
import { Reply } from '../../models/reply.class';


@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.scss',
})
export class InputTextareaComponent {

  @Input() channel!: Channel | undefined;
  @Input() msg!: ChannelMessage;
  @Input() channelMsg: Boolean = false;

  @ViewChild('messageText') messageText!: ElementRef;

  isButtonDisabled: boolean = true;

  constructor(private data: DataService, private messageFBS: ChannelMessagesService) { }

  updateButtonState(textValue: string): void {
    this.isButtonDisabled = !textValue.trim();
  }

  /////// INPUT FORM EVENTLISTENDER FOR KEYBOARD ENTER + SHIFT/ENTER///////
  handleEnter(event: Event, textValue: string): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) {
    } else {
      event.preventDefault();
      if (textValue.trim()) {
        this.addNewMsg(textValue.trim());
        if (this.messageText) {
          this.messageText.nativeElement.value = '';
        }
      }
    }
  }


  addNewMsg(text: string) {
    if (this.channelMsg) this.addNewChannelMsg(text)
    else this.addNewReplyMsg(text)
  }


  async addNewChannelMsg(text: string) {
    let newMsg: ChannelMessage | undefined = this.fillChannelMsg(text);
    let id: any;
    if (!newMsg) return
    id = await this.messageFBS.addChannelMessage(newMsg);
    if (!id) return
    newMsg.id = id;
    await this.messageFBS.updateChannelMessage(newMsg);
  }


  fillChannelMsg(text: string) {
    if (!this.data.currentUser.id) return
    if (!this.channel|| this.channel.id === '') return
    let msg = new ChannelMessage();
    msg.date = new Date().getTime();
    msg.channelID = this.channel.id;
    msg.fromUserID = this.data.currentUser.id;
    msg.message = text;
    return msg
  }


  async addNewReplyMsg(text: string) {
    let newReply: Reply | undefined = this.fillReplyMsg(text)
    if (!newReply || !this.msg) return
    this.msg.replies.push(newReply);
    await this.messageFBS.updateChannelMessage(this.msg);
  }


  fillReplyMsg(text: string) {
    if (!this.data.currentUser.id) return
    if (!this.channel || this.channel.id === '') return
    let reply = new Reply();
    reply.date = new Date().getTime();
    reply.channelID = this.channel.id;
    reply.userID = this.data.currentUser.id;
    reply.message = text;
    return reply
  }


}
