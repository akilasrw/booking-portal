import { CryptoService } from './shared/services/crypto.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './account/account.service';
import { User } from './_models/user.model';
import { Constants } from './core/constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aeroclub cargo client';
  isLoaded = false;

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

}
