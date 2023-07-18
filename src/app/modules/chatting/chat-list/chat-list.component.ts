import { DatePipe, NgForOf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { ParticipantRm } from 'src/app/_models/request-models/chatting/participant-rm.model';
import { User } from 'src/app/_models/user.model';
import { ChatUser } from 'src/app/_models/view-models/chatting/chat-user.model';
import { ParticipantConversation } from 'src/app/_models/view-models/chatting/participant-conversation.model';
import { Participant } from 'src/app/_models/view-models/chatting/participant.model';
import { ChatService } from 'src/app/_services/chat.service';
import { Conversation } from 'src/app/_models/view-models/chatting/conversation.model';
import { Message } from 'src/app/_models/view-models/chatting/message.model';
import { UserConversation } from 'src/app/_models/view-models/chatting/user-conversation.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { environment } from 'src/environments/environment';
import { MessageList } from 'src/app/_models/view-models/chatting/message-list';

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
  conversations?: Conversation[]=[];
  currentUserConversations?: UserConversation[] =[];
  searchText? :string ='';
  filteredMsgs: MessageList[]=[];
  msgUser: string = environment.backofficeUsername;
  backofficeUserEmail = environment.backofficeEmail;
  timer?:number = 0;
  @Output() popupCreate = new EventEmitter<any>();
  @Output() newChatPopup = new EventEmitter<any>();

  constructor(private accountService: AccountService,
              private chatService: ChatService,
              ) { }

  ngOnInit(): void {
    // this.LoadConversations()
    this.initializeChat();
    this.filteredMsg();
    this.startChattingTimer();
  }

  initializeChat() {
    // get the email of logged user
    this.getCurrentUser();
    let userName =  this.currentUser?.username!;

    if(userName) {
      // Get all user from twilio
      this.chatService.getUsers()
      .subscribe(res => {

        this.chatUsers = res;
        var user = this.chatUsers.filter(x=>x.identity == userName);
        // Check exists the user,
        if (user.length == 0) { // user not exists
          // Create user
          this.chatService.createUser(userName)
          .subscribe(x=> {
            this.loadUserConversation(user,userName);
            this.loadParticipantConversation(userName);
          });
        } else { // user exists
          this.loadUserConversation(user,userName);
          this.loadParticipantConversation(userName)
        }
      });
    }
  }

  loadParticipantConversation(userName: string) {
    this.chatService.getParticipantConversation(userName)
    .subscribe(s=> {

      if(s.length>0) {
        this.participantConversations = s;
      } else {
      }
      // if no exisiting msgs,
      // create new message
      // else show exisiting msgs
    });
  }

  loadUserConversation(user: ChatUser[], userName: string){
    if(user.length > 0)
        this.chatService.getUserConversation(userName)
        .subscribe(o=> {
          if(o.length >0){
            this.currentUserConversations =[]
            o.forEach(el=> {
              if(el.conversationSid)
                this.loadMessages(el.conversationSid);
            });
          } else {
              // this.createParticipant(userName,)
          }
        });
  }

  createParticipant(username: string, conversationSid: string){
    var participant : ParticipantRm= new ParticipantRm();
    participant.identity = username;
    participant.conversationSid = conversationSid;
    this.chatService.createParticipant(participant)
    .subscribe(y=> {

    });
  }

  // Get all messages by Auther/ identity
  loadMessages (conversationId: string) {
      this.chatService.getMessages(conversationId)
      .subscribe(c=> {
        var messages: Message[]=[];
        c.forEach(el=>{
          messages.push(el);
        });
        const users :UserConversation = {conversationSid: conversationId, messages: messages};
        // remove if already existed.
        if(this.currentUserConversations && this.currentUserConversations?.find(c=>c.conversationSid == conversationId)) {
          const index = this.currentUserConversations.findIndex(obj => obj.conversationSid === conversationId);
          if (index !== -1) {
            this.currentUserConversations.splice(index, 1);
          }
        }
        this.currentUserConversations?.push(users);
      });
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  getFirstLetters(str: string) {
      return CoreExtensions.GetFirstLetters(str);
  }

  popupMessage(conversationId: string) {
    var con = this.getUserConversation(conversationId);
    if(con) {
      this.updateMsgReadStatus(con);
      this.popupCreate.emit(con);
    }else {
      this.newChat();
    }
  }

  newChat() {
    this.newChatPopup.emit();
  }

  getUserConversation(conversationId: string) {
    return this.currentUserConversations?.find(x=> x.conversationSid = conversationId);
  }

  updateMsgReadStatus(con: UserConversation) {
    con.messages?.forEach(msg=> {
      if(msg.chatStatus.isRead != true) {
        msg.chatStatus = { isRead : true}
        this.updateMessage(msg);
      }
    });
  }

  updateMessage(msg: Message) {
    this.chatService.updateMessage(msg)
    .subscribe(res=>{

    });
  }

  unreadCount(conversationId: string) {
    var con = this.getUserConversation(conversationId);
    if(!con || con.messages?.length == 0) {
      return 0;
    }

    if(con?.messages && con?.messages[con?.messages?.length-1]?.auther != this.currentUser?.username) {
      return con.messages?.filter(x=>x.chatStatus?.isRead == undefined || x.chatStatus?.isRead == false).length;
    }

    return 0;
  }

  filteredMsg(val?: string) {
    this.filteredMsgs =[];
    if(this.currentUserConversations && this.currentUserConversations?.length > 0) {
      this.currentUserConversations?.forEach(el => {
        if(el.messages) {
          this.filteredMsgs.push({
            'conversationId' : el?.conversationSid!,
            'created': el?.messages[el?.messages?.length-1]?.created,
            'lastMessageBody': el?.messages[el?.messages?.length-1]?.body,
            'userName': el?.messages[el?.messages?.length-1]?.auther,
            'isNew' : false});
        }
      });
    } else {
      var user = this.backofficeUserEmail;
        if(this.searchText != undefined && this.searchText !='') {
          if(this.filteredMsgs.filter(x=>x.userName == user).length == 0 && user.indexOf(this.searchText)>-1) {
            this.filteredMsgs.push({'conversationId' : '' ,'created': '', 'lastMessageBody': '', 'userName': user, 'isNew' : true});
          }
        }
    }
    return this.filteredMsgs

    // var cons:UserConversation[]=[];
    // var filteredChats = this.currentUserConversations;
    // if(this.searchText != undefined && this.searchText !='') {
    //   cons=[];
    //   this.currentUserConversations?.forEach(con => {
    //     let text = this.searchText? this.searchText:'';
    //     let msgs = con?.messages?.filter(y=>y.body.indexOf(text) > -1);
    //     if(msgs)
    //       if(msgs.length > 0){
    //         cons.push(con);
    //         return;
    //       }
    //   });
    //   if(cons.length>0) {
    //     return cons;
    //   }
    // } else if (this.searchText === '') {
    //   if(filteredChats && filteredChats.length > 0) {
    //     filteredChats?.sort((a,b)=> {
    //       if(a && b && a.messages && b.messages)
    //         return new Date(b?.messages[b?.messages?.length-1]?.created).valueOf() - new Date(a?.messages[a?.messages?.length-1]?.created).valueOf();
    //       return -1;
    //     });
    //   } console.log(filteredChats)
    //   return filteredChats;
    // }
    // return cons;
  }

  startChattingTimer() {
    this.timer = window.setInterval(() => {
      this.callLoadMsgs();
    }, 2000);
  }

  callLoadMsgs() {
    this.currentUserConversations?.forEach(currentUserConversation=>{
      if(currentUserConversation?.conversationSid) {
        var chId = currentUserConversation?.conversationSid;
        this.loadMessages(chId);
      }
    });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.timer);
    this.subscription?.unsubscribe();
  }
}
