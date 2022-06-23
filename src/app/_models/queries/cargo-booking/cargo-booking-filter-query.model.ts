import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class CargoBookingFilterQuery extends BasePaginationQuery {
  bookingId?: string;
  destination?: string;
  bookingDate?: Date;
  userId?:string;
}
