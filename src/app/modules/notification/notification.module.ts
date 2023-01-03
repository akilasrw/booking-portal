import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationViewDetailComponent } from './notification-view-detail/notification-view-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationViewDetailComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule,
  ]
})
export class NotificationModule { }
