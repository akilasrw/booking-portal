import { BaseService } from './../core/services/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgentRateFilterQuery} from '../_models/queries/cargo-rate/agent-rate-filter-query.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';
import { AgentRateManagement } from '../_models/view-models/cargo-rate-list/agent-rate-management.model';

@Injectable({
  providedIn: 'root'
})
export class CargoRateListService extends BaseService {

  private readonly endpointEntityName = 'AgentRateManagement';
  private readonly getFilteredRateListEndpoint = `${this.endpointEntityName}/GetFilteredAgentRateList`;


  constructor(http:HttpClient) {
    super(http);
   }

  getFilteredRateList(query: AgentRateFilterQuery) {
    var params = new HttpParams();
    if (query.userId) {
      params = params.append("userId", query.userId);
    }

    if (query.originAirportId) {
      params = params.append("originAirportId", query.originAirportId);
    }

    if (query.destinationAirportId) {
      params = params.append("destinationAirportId", query.destinationAirportId);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<AgentRateManagement>>(
      this.getFilteredRateListEndpoint,
      params
    );
  }

}
