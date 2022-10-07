import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class AgentRateFilterQuery extends BasePaginationQuery {
  userId?: string;
  originAirportId?: string;
  destinationAirportId?: string;
}
