import { NotificationModel } from './../../../_models/view-models/notification/notification.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-view-detail',
  templateUrl: './notification-view-detail.component.html',
  styleUrls: ['./notification-view-detail.component.scss']
})
export class NotificationViewDetailComponent implements OnInit {

  @Input() notificationDetail?: NotificationModel;
   description: any;
   label: Array<string> = [];
   labelValue: Array<string> = [];
   index: any = 0;
 

  constructor() { }

  ngOnInit(): void {
    let body = this.notificationDetail?.body;
    let values = body?.split(",");
    if (values != undefined) {
      this.description = values.pop();
      for (let i in values) {
        this.index++;
        let value = values[i].split(";");
          this.label.push(value[0]);
          this.labelValue.push(value[1]);
        value = [];
      }
    }
    
   
  }

}
