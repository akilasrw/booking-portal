import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { ChatUser } from '../_models/view-models/chatting/chat-user.model';
import { Message } from '../_models/view-models/chatting/message.model';
import { ParticipantConversation } from '../_models/view-models/chatting/participant-conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseService {

  private readonly endpointEntityName = 'chat';
  private readonly endpointEntityCreateUser =  `${this.endpointEntityName}/createUser`;
  private readonly endpointEntityCreateParticipant=  `${this.endpointEntityName}/createParticipant`;
  private readonly endpointEntityGetUsers=  `${this.endpointEntityName}/getUserList`;
  private readonly endpointEntityGetParticipantConversation=  `${this.endpointEntityName}/getParticipantConversation`;
  private readonly endpointEntityGetMessages=  `${this.endpointEntityName}/getMessages`;



  constructor(http: HttpClient) {
    super(http);
   }

  sendChat(msg: any){
      return this.post<any>(this.endpointEntityName, msg);
  }

  createUser(userName: string) {
    return this.post<any>(this.endpointEntityCreateUser, userName);
  }

  createParticipant(userName: string) {
    return this.post<any>(this.endpointEntityCreateParticipant, userName);
  }

  getParticipantConversation(userName: string) {
    var params = new HttpParams();
    if (userName) {
      params = params.append("userName", userName);
    }
    return this.getWithParams<ParticipantConversation[]>(this.endpointEntityGetParticipantConversation, params);
  }

  getUsers() {
    return this.get<ChatUser[]>(this.endpointEntityGetUsers);
  }

  getMessages(pathConversationSid: string ) {
    return this.get<Message[]>(this.endpointEntityGetMessages);
  }

}
