import { AccountService } from './../../../account/account.service';
import { Component, OnInit } from '@angular/core';
import { NotificationFilterQuery } from 'src/app/_models/queries/notification/notification-filter-query.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { NotificationModel } from "src/app/_models/view-models/notification/notification.model";
import { NotificationType } from 'src/app/core/enums/common-enums';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  isLoading = false;
  notificationFilterQuery: NotificationFilterQuery = new NotificationFilterQuery();
  notificationList:NotificationModel[]=[];
  selectedNotification?:NotificationModel;
  totalCount: number = 0;
  currentUser?: User | null
  subscription?: Subscription;

  constructor(
    private notificationService:NotificationService,
    private accountService:AccountService
  ) { }

  ngOnInit(): void {
    this. getCurrentUser();
  }


  show(notification:NotificationModel) {
    this.modalVisible = true;
    this.selectedNotification = notification;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  hide() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }


  closePopup(isSuccess: Boolean) {
    this.hide();
  }

  getNotifications() {
    this.isLoading = true;
    this.notificationFilterQuery.userId= this.currentUser!.id;
    this.notificationService.getFilteredList(this.notificationFilterQuery).subscribe(res => {
      this.notificationList = res?.data ?? [];
      this.totalCount = res.count;
      this.isLoading = false;
    });
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
      this.getNotifications();
    });
  }

  get notificationType(): typeof NotificationType {
    return NotificationType;
  }
}
