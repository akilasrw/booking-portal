import { ToastrService } from 'ngx-toastr';
import { NotificationFilterType } from './../../../core/enums/common-enums';
import { AccountService } from './../../../account/account.service';
import { Component, OnInit } from '@angular/core';
import { NotificationFilterQuery } from 'src/app/_models/queries/notification/notification-filter-query.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { NotificationModel } from "src/app/_models/view-models/notification/notification.model";
import { NotificationType } from 'src/app/core/enums/common-enums';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonMessages } from 'src/app/core/constants/common-messages';

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
  filterForm?: FormGroup;

  constructor(
    private notificationService:NotificationService,
    private accountService:AccountService,
    private fb: FormBuilder,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.createFilterForm();
    this.getCurrentUser();
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      filterType: [NotificationFilterType.All]
    })
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
    this.notificationFilterQuery.filterType= this.filterForm?.get('filterType')?.value;
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

  onDelete(id:string){
    console.log("On Delete");
    this.isLoading=true;
    this.notificationService.deleteNotification(id).subscribe(
      {
        next: (res) => {
          this.toastr.success(CommonMessages.DeletedSuccessMsg);
          this.notificationList = [];
          this.isLoading=false;
          this.getNotifications();
        },
        error: (error) => {
          this.toastr.error(CommonMessages.DeleteFailMsg);
          this.isLoading=false;
        }
      }
    );
  }
}
