import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationFilterQuery } from '../_models/queries/notification/notification-filter-query.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';
import { NotificationModel } from '../_models/view-models/notification/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService{

  private readonly endpointEntityName = 'Notification';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/getFilteredList`;

  constructor(http:HttpClient) {
    super(http);
  }

  getFilteredList(query: NotificationFilterQuery) {
    var params = new HttpParams();
    if (query.userId) {
      params = params.append("userId", query.userId);
    }

    if (query.isUnread) {
      params = params.append("isUnread", query.isUnread);
    }
    
    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<NotificationModel>>(
      this.getFilteredListEndpoint,
      params
    );
  }


}
