import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class NotificationFilterQuery extends BasePaginationQuery {
    userId?:string;
    isUnread?:boolean;
}