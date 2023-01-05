import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // TODO:
    // get the email of logged user

    // Get all user from twilio

    // Check exists the user,
    //    if not exists
    //      Create user, particpant
    //    else
    //      Get conversation by userid
  }

}
