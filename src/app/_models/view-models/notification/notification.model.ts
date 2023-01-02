import { NotificationType } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";
export class NotificationModel extends BaseVM{
    title?:string;
    body?:string;
    notificationType?: NotificationType;
    isRead?:boolean;
    userId?:string;
    created?:Date;
  }
  