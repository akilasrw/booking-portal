import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChattingRoutingModule } from './chatting-routing.module';
import { ChatCreateComponent } from './chat-create/chat-create.component';
import { ChatListComponent } from './chat-list/chat-list.component';


@NgModule({
  declarations: [
    ChatCreateComponent,
    ChatListComponent
  ],
  imports: [
    CommonModule,
    ChattingRoutingModule
  ],
  exports:[
    ChatListComponent,
    ChatCreateComponent
  ]
})
export class ChattingModule { }
