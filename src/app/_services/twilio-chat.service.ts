import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwilioChatService { // this class needs to be removed. - Yohan

  baseUr: string ='https://conversations.twilio.com/v1';
  twilioUserName: string = 'AC704d657e6c0a6363d7c1b9f93af91976';
  twilioPassword: string = '3c3a5884d40d8a57080fc906216d142c';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa(this.twilioUserName+':'+ this.twilioPassword),
    })
  };

  protected getRequestHeaders(): { headers: HttpHeaders } {
    let headerList = new HttpHeaders({ 'Content-Type': 'application/json' });
    headerList = headerList.append('Cache-Control', 'no-cache');
    headerList = headerList.append("Access-Control-Allow-Origin", "*")
    headerList = headerList.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    headerList = headerList.append("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    //headerList = headerList.append("Authorization", 'Basic ' + btoa(this.twilioUserName+':'+ this.twilioPassword))
    headerList = headerList.append("Authorization", 'Basic QUM3MDRkNjU3ZTZjMGE2MzYzZDdjMWI5ZjkzYWY5MTk3NjozYzNhNTg4NGQ0MGQ4YTU3MDgwZmM5MDYyMTZkMTQyYw==')
    return { headers: headerList };
  }

  constructor(private http: HttpClient) { }

  getParticipants(conversionId: string){
    return this.http.get<any[]>(`${this.baseUr}/Conversations/${conversionId}/Participants`, this.httpOptions);
  }

  getConversationByUserId(userId: string){
    return this.http.get<any>(`${this.baseUr}/Users/${userId}/Conversations`, this.httpOptions);
  }

  getMessages(conversionId: string) {
    return this.http.get<any[]>(`${this.baseUr}/Conversations/${conversionId}/Messages`, this.httpOptions);
  }

  getMessageById(conversionId: string, msgId: string) {
    return this.http.get<any>(`${this.baseUr}/Conversations/${conversionId}/Messages/${msgId}`, this.httpOptions);
  }

  getAllUsers() {
    return this.http.get<any[]>(`${this.baseUr}/Users`, this.getRequestHeaders());
  }

  getUserById(userId: string) {
    return this.http.get<any>(`${this.baseUr}/Users/${userId}`, this.httpOptions);
  }

}
