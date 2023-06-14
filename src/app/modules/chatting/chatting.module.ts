import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChattingRoutingModule } from './chatting-routing.module';
import { ChatCreateComponent } from './chat-create/chat-create.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';


@NgModule({
  declarations: [
    ChatCreateComponent,
    ChatListComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    ChattingRoutingModule,
    SharedModule
  ],
  exports:[
    ChatListComponent,
    ChatCreateComponent
  ]
})
export class ChattingModule { }
