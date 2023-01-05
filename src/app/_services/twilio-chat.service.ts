import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwilioChatService {

  baseUr: string ='https://conversations.twilio.com/v1';
  twilioUserName: string = 'AC704d657e6c0a6363d7c1b9f93af91976';
  twilioPassword: string = '3c3a5884d40d8a57080fc906216d142c';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa(this.twilioUserName+':'+ this.twilioPassword)
    })
  };

  constructor(private http: HttpClient) { }

  getParticipants(conversionId: string){
    return this.http.get<any>(`${this.baseUr}/Conversations/${conversionId}/Participants`, this.httpOptions);
  }

  getConversationByUserId(userId: string){
    return this.http.get<any>(`${this.baseUr}/Users/${userId}/Conversations`, this.httpOptions);
  }

  getMessages(conversionId: string) {
    return this.http.get<any>(`${this.baseUr}/Conversations/${conversionId}/Messages`, this.httpOptions);
  }

  getMessageById(conversionId: string, msgId: string) {
    return this.http.get<any>(`${this.baseUr}/Conversations/${conversionId}/Messages/${msgId}`, this.httpOptions);
  }

  getAllUsers() {
    return this.http.get<any>(`${this.baseUr}/Users`, this.httpOptions);
  }

  getUserById(userId: string) {
    return this.http.get<any>(`${this.baseUr}/Users/${userId}`, this.httpOptions);
  }

}
