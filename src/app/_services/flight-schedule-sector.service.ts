import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlightScheduleSectorQuery } from '../_models/queries/flight-schedule-sector/flight-schedule-sector-query.model';
import { FlightScheduleSector } from '../_models/view-models/flight-schedule-sectors/flight-schedule-sector.model';

@Injectable({
  providedIn: 'root'
})
export class FlightScheduleSectorService extends BaseService{
  private readonly endpointEntityName = 'flightScheduleSector';

  constructor(http: HttpClient) {
    super(http);
  }

  getFlightScheduleSector(query: FlightScheduleSectorQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }
    return this.getWithParams<FlightScheduleSector>(this.endpointEntityName,params);
  }
}
