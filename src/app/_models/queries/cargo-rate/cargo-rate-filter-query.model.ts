import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class CargoRateFilterQuery extends BasePaginationQuery {
  destinationAirportId?: string;
  originAirportId?: string;
}
