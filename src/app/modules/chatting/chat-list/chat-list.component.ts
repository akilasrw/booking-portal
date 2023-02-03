import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/_models/user.model';
import { ChatUser } from 'src/app/_models/view-models/chatting/chat-user.model';
import { ParticipantConversation } from 'src/app/_models/view-models/chatting/participant-conversation.model';
import { Participant } from 'src/app/_models/view-models/chatting/participant.model';
import { ChatService } from 'src/app/_services/chat.service';
import { TwilioChatService } from 'src/app/_services/twilio-chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  currentUser?:User | null;
  subscription?:Subscription;
  conversations?:string[]=[];
  chatUsers: ChatUser[]=[];
  participants: Participant[]=[];
  participantConversations:ParticipantConversation[]=[];

  constructor(private accountService: AccountService,
              private twilioChatService: TwilioChatService,
              private chatService: ChatService) { }

  ngOnInit(): void { debugger
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
      if (user.length == 0) { // not exists
        //      Create user
        this.chatService.createUser(userName)
        .subscribe(x=> {  debugger;
          console.log(x);

        });
      } else {

      }

      // Get coversation of participant
      this.chatService.getParticipantConversation(userName)
      .subscribe(s=> { debugger
        if(s.length>0) {
          this.participantConversations = s; console.log(s);


        } else {
          // if no record
          //      Create particpant
          this.chatService.createParticipant(userName)
          .subscribe(y=> { debugger;
            console.log(y);
            // create conversation
          });
        }


        // Get all messages by Auther/ identity
        this.chatService.getMessages(this.participantConversations[0].conversationSid)
        .subscribe(c=> {debugger; console.log(c);

        })
        // if no exisiting msgs,
        // create new message
        // else show exisiting msgs
      });
    });

    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

}
