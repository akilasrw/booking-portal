import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { ConversationRm } from '../_models/request-models/chatting/conversation-rm.model';
import { ParticipantRm } from '../_models/request-models/chatting/participant-rm.model';
import { ChatUser } from '../_models/view-models/chatting/chat-user.model';
import { MessageRm } from '../_models/view-models/chatting/message-rm.model';
import { Message } from '../_models/view-models/chatting/message.model';
import { ParticipantConversation } from '../_models/view-models/chatting/participant-conversation.model';
import { Participant } from '../_models/view-models/chatting/participant.model';
import { UserConversation } from '../_models/view-models/chatting/user-conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseService {

  private readonly endpointEntityName = 'chat';
  private readonly endpointEntityCreateUser =  `${this.endpointEntityName}/createUser`;
  private readonly endpointEntityCreateParticipant=  `${this.endpointEntityName}/createParticipant`;
  private readonly endpointEntityGetUsers=  `${this.endpointEntityName}/getUserList`;
  private readonly endpointEntityGetParticipantConversation=  `${this.endpointEntityName}/getParticipantConversation`;
  private readonly endpointEntityGetUserConversation=  `${this.endpointEntityName}/getUserConversation`;
  private readonly endpointEntityGetMessages=  `${this.endpointEntityName}/getMessages`;
  private readonly endpointEntityCreateConversation=  `${this.endpointEntityName}/createConversation`;
  private readonly endpointEntityGetConversations=  `${this.endpointEntityName}/getConversations`;
  private readonly endpointEntityCreateMessage=  `${this.endpointEntityName}/createMessage`;



  constructor(http: HttpClient) {
    super(http);
   }

  sendChat(msg: any){
      return this.post<any>(this.endpointEntityName, msg);
  }

  createMessage(msg : MessageRm) {
    return this.post<Message>(this.endpointEntityCreateMessage, msg)
  }

  createUser(userName: string) {
    return this.post<any>(this.endpointEntityCreateUser, userName);
  }

  createParticipant(participant: ParticipantRm) {
    return this.post<any>(this.endpointEntityCreateParticipant, participant);
  }

  createConversation(conversation: ConversationRm) {
    return this.post<any>(this.endpointEntityCreateConversation, conversation);
  }

  getParticipantConversation(userName: string) {
    var params = new HttpParams();
    if (userName) {
      params = params.append("userName", userName);
    }
    return this.getWithParams<ParticipantConversation[]>(this.endpointEntityGetParticipantConversation, params);
  }

  getConversations() {
    return this.get<any[]>(this.endpointEntityGetConversations);
  }

  getUserConversation(identity: string, conversationSid: string) {
    var params = new HttpParams();
    if (identity) {
      params = params.append("identity", identity);
    }
    if (conversationSid) {
      params = params.append("pathConversationSid", conversationSid);
    }
    return this.getWithParams<UserConversation[]>(this.endpointEntityGetUserConversation, params);
  }

  getUsers() {
    return this.get<ChatUser[]>(this.endpointEntityGetUsers);
  }

  getMessages(pathConversationSid: string ) {
    var params = new HttpParams();
    if (pathConversationSid) {
      params = params.append("pathConversationSid", pathConversationSid);
    }
    return this.getWithParams<Message[]>(this.endpointEntityGetMessages, params);
  }

}
