import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { User } from 'src/app/_models/user.model';
import { MessageRm } from 'src/app/_models/view-models/chatting/message-rm.model';
import { UserConversation } from 'src/app/_models/view-models/chatting/user-conversation.model';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-chat-create',
  templateUrl: './chat-create.component.html',
  styleUrls: ['./chat-create.component.scss']
})
export class ChatCreateComponent implements OnInit {

  currentUser?:User | null;
  subscription?:Subscription;
  @Input() currentUserConversation?: UserConversation;

  constructor(private accountService: AccountService,
    private chatService: ChatService) { }

  ngOnInit(): void {
    console.log('ngOnInit',this.currentUserConversation);
  }


  sendMsg(event: any) { debugger;
    console.log('enter',event);
    var msg: MessageRm = new MessageRm();
    msg.auther =  this.currentUser?.username;
    msg.body = event;
    msg.pathConversationSid = this.currentUserConversation?.conversationSid; // 'CHee0e231a0ff24be182a8b486b4c4bde1';
    this.chatService.createMessage(msg)
    .subscribe(res=> {

      // if(msg?.pathConversationSid)
      //   this.loadMessages(msg?.pathConversationSid);
    });
  }

  getFirstLetters(str: string) {
    return CoreExtensions.GetFirstLetters(str);
}

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
