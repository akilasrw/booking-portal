import { DatePipe, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { ConversationRm } from 'src/app/_models/request-models/chatting/conversation-rm.model';
import { ParticipantRm } from 'src/app/_models/request-models/chatting/participant-rm.model';
import { User } from 'src/app/_models/user.model';
import { ChatUser } from 'src/app/_models/view-models/chatting/chat-user.model';
import { ParticipantConversation } from 'src/app/_models/view-models/chatting/participant-conversation.model';
import { Participant } from 'src/app/_models/view-models/chatting/participant.model';
import { ChatService } from 'src/app/_services/chat.service';
import { TwilioChatService } from 'src/app/_services/twilio-chat.service';
import { formatDate } from '@angular/common';
import { Conversation } from 'src/app/_models/view-models/chatting/conversation.model';
import { Message } from 'src/app/_models/view-models/chatting/message.model';
import { MessageRm } from 'src/app/_models/view-models/chatting/message-rm.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  currentUser?:User | null;
  subscription?:Subscription;
  chatUsers: ChatUser[]=[];
  participants: Participant[]=[];
  participantConversations:ParticipantConversation[]=[];
  isNewConversation: boolean = false;
  conversationId: string = '';
  messages: Message[]=[];
  conversations?: Conversation[]=[];

  constructor(private accountService: AccountService,
              private twilioChatService: TwilioChatService,
              private chatService: ChatService,
              ) { }

  ngOnInit(): void {
    this.LoadConversations()
    this.initializeChat()
  }

  initializeChat() {
    debugger
    // get the email of logged user
    this.getCurrentUser();
    let userName =  this.currentUser?.username!;

    if(userName) {
      // Get all user from twilio
    this.chatService.getUsers()
    .subscribe(res => { debugger; console.log(res);

      this.chatUsers = res;
      var user = this.chatUsers.filter(x=>x.identity == userName);
      // Check exists the user,
      if (user.length == 0) { // user not exists
        // Create user
        this.chatService.createUser(userName)
        .subscribe(x=> {
          debugger;
          console.log(x);
          //this.loadUserConversation(user,userName);
          //this.loadParticipantConversation(userName)
        });
      } else { // user exists
        debugger;
        if(this.isNewConversation)
          this.createConversation(userName);

        this.loadUserConversation(user,userName);
        this.loadParticipantConversation(userName)
      }
    });

    }
  }

  loadParticipantConversation(userName: string) {
    this.chatService.getParticipantConversation(userName)
    .subscribe(s=> {
      debugger;
      if(s.length>0) {
        this.participantConversations = s;
        console.log(s);


      } else {
        debugger;

        // if no record
        if(this.isNewConversation)
          this.createConversation(userName);
      }
      // if no exisiting msgs,
      // create new message
      // else show exisiting msgs
    });
  }

  loadUserConversation(user: ChatUser[], userName: string){
    if(user.length > 0)
        this.chatService.getUserConversation(userName, user[0].chatServiceSid)
        .subscribe(o=> {
          console.log(o);
          debugger;
          if(o.length >0){
            o.forEach(el=> {
              this.loadMessages(el.conversationSid)
            });
          } else {
              // this.createParticipant(userName,)
          }

        });
  }

  LoadConversations() {
    this.chatService.getConversations()
    .subscribe(res=> {
      this.conversations= res;
      // this.messages=[];
      // this.conversations.forEach(el=> {
      //   if(el.sid)
      //   this.loadMessages(el.sid);
      // });
    });
  }


  createParticipant(username: string, conversationSid: string){
    var participant : ParticipantRm= new ParticipantRm();
    participant.identity = username;
    participant.conversationSid = conversationSid;
    this.chatService.createParticipant(participant)
    .subscribe(y=> {
      debugger;
      console.log(y);
    });
  }

  createConversation(username: string) {
    // create conversation
    var conversation: ConversationRm = new ConversationRm();
    let currentDateTime = formatDate(new Date().toString(), 'yyyy-MM-dd', 'en-US');
    let name = username + '_'+ currentDateTime?.toString();
    conversation.friendlyName = name;
    conversation.uniqueName = name;

    this.chatService.createConversation(conversation)
    .subscribe(t=> {
      debugger;
      console.log(t);
      // Create particpant
      this.createParticipant(username, t.sid);
      // add Admin to the conservation
      this.createParticipant('backofficeadmin@yopmail.com', t.sid);

    });
  }

  // Get all messages by Auther/ identity
  loadMessages (conversationId: string) {
      this.chatService.getMessages(conversationId)
      .subscribe(c=> {
        debugger;
        console.log(c);
        c.forEach(el=>{
          this.messages.push(el);
        });
      });
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  sendMsg(event: any) { debugger;
    console.log('enter',event);
    var msg: MessageRm = new MessageRm();
    msg.auther =  this.currentUser?.username;
    msg.body = event;
    msg.pathConversationSid = 'CHee0e231a0ff24be182a8b486b4c4bde1';
    this.chatService.createMessage(msg)
    .subscribe(res=> {
      debugger;
    })
  }
}
