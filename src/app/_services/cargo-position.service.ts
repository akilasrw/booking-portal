import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { Validate } from '../shared/models/validate.model';
import { FlightScheduleSectorQuery } from '../_models/queries/flight-schedule-sector/flight-schedule-sector-query.model';
import { ValidateCargoPositionRequest } from '../_models/request-models/cargo-booking/validate-cargo-position-request.model';
import { SeatAvailability } from '../_models/view-models/seat-configuration/seat-availability.model';

@Injectable({
  providedIn: 'root'
})
export class CargoPositionService extends BaseService{

  private readonly endpointEntityName = 'CargoPosition';
  private readonly validateEndpoint = `${this.endpointEntityName}/Validate`;



  constructor(http: HttpClient) {
    super(http);
  }

  validateWeight(validateRequest : ValidateCargoPositionRequest){
    return  this.post<Validate>(this.validateEndpoint, validateRequest);
  }

  getAvailableThreeSeats(query: FlightScheduleSectorQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
      params = params.append("includeLoadPlan", query.includeLoadPlan);
    }
    return this.getWithParams<SeatAvailability>(this.endpointEntityName,params);
  }

}

