import { NotificationModel } from './../../../_models/view-models/notification/notification.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-view-detail',
  templateUrl: './notification-view-detail.component.html',
  styleUrls: ['./notification-view-detail.component.scss']
})
export class NotificationViewDetailComponent implements OnInit {

  @Input() notificationDetail?: NotificationModel;

  constructor() { }

  ngOnInit(): void {
  }

}
