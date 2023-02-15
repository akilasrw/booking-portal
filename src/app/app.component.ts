import { CryptoService } from './shared/services/crypto.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './account/account.service';
import { User } from './_models/user.model';
import { Constants } from './core/constants/constants';
import { UserConversation } from './_models/view-models/chatting/user-conversation.model';
import { ChatListComponent } from './modules/chatting/chat-list/chat-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aeroclub cargo client';
  isLoaded = false;
  public showCollapseMenu:boolean=false;
  chatModalVisible = false;
  chatModalVisibleAnimate = false;
  chatCreateModalVisible = false;
  chatCreateModalVisibleAnimate = false;
  currentUserConversation?: UserConversation;
  isNewChat: boolean = false;

  @ViewChild(ChatListComponent) child:any;

  constructor(
    public translate: TranslateService,
    public accountService: AccountService,
    private cryptoService: CryptoService
  ) {
    translate.addLangs(['en', 'vi']);
    var userSelectedLanguage = localStorage.getItem(Constants.LANGUAGE)
    if (userSelectedLanguage == null) {
      userSelectedLanguage = "en";
    }
    translate.setDefaultLang(userSelectedLanguage);
    translate.currentLang = userSelectedLanguage;
  }

  ngOnInit() {
    this.setCurrentUser();
  }

  switchLang(lang: string) {
    localStorage.setItem('UserSelectedLanguage', lang);
    this.translate.use(lang);
  }

  setCurrentUser() {
    let user: User;
    const userValue = localStorage.getItem('user');
    if (userValue && userValue != "null") {
      var decUser = this.cryptoService.decrypt(userValue);
      user = JSON.parse(decUser);
      this.accountService.setCurrentUser(user);
    } else {
      this.accountService.removeCurrentUser();
    }
    this.isLoaded = true;
  }

  hideMenu(valu:any){
    this.showCollapseMenu=valu;
  }

  cancelchatModal() {
    this.chatModalVisibleAnimate = false;
    setTimeout(() => (this.chatModalVisible = false), 300);
  }

  closeChatCreate() {
    this.chatCreateModalVisibleAnimate = false;
    setTimeout(() => (this.chatCreateModalVisible = false), 300);
    this.child.initializeChat();
  }

  showChatBox(val: any) {
    this.chatModalVisible = true;
    setTimeout(() => (this.chatModalVisibleAnimate = true));
  }

  showMsgCreatePopup(event: any) {
    this.isNewChat = false;
    this.currentUserConversation = event;
    this.chatCreateModalVisible= true;
    setTimeout(() => (this.chatCreateModalVisibleAnimate = true));
  }

  showNewChatPopup(){
    this.isNewChat = true;
    this.currentUserConversation = undefined;
    this.chatCreateModalVisible= true;
    setTimeout(() => (this.chatCreateModalVisibleAnimate = true));
  }

}
