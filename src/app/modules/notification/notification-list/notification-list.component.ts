import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;

  constructor() { }

  ngOnInit(): void {
  }


  show() {
    debugger
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  hide() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }


  closePopup(isSuccess: Boolean) {
    this.hide();
  }


}
