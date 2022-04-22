import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class BookingFilterListQuery extends BasePaginationQuery {
  originAirportId?: string;
  destinationAirportId?: string;
  scheduledDepartureDateTime?: Date;
}
