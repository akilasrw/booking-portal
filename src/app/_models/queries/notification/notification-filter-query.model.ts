import { NotificationFilterType } from './../../../core/enums/common-enums';
import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class NotificationFilterQuery extends BasePaginationQuery {
    userId?:string;
    filterType?:NotificationFilterType;
}