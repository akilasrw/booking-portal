import { BaseService } from './../core/services/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CargoRateFilterQuery } from '../_models/queries/cargo-rate/cargo-rate-filter-query.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';
import { CargoRate } from '../_models/view-models/cargo-rate-list/cargo-rate.model';

@Injectable({
  providedIn: 'root'
})
export class CargoRateListService extends BaseService {

  private readonly getFilteredListEndpoint = 'rate/getFilteredList';


  constructor(http:HttpClient) {
    super(http);
   }


  getFilteredRateList(query: CargoRateFilterQuery){
    var params = new HttpParams();
    if (query.destinationAirportId) {
      params = params.append("destinationAirportId", query.destinationAirportId);
    }

    if (query.originAirportId) {
      params = params.append("originAirportId", query.originAirportId);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<CargoRate>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
