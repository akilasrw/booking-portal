import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { CargoBookingRequest } from '../_models/view-models/cargo-booking/cargo-booking-request.model';

@Injectable({
  providedIn: 'root'
})
export class UldCargoBookingService extends BaseService {


  private readonly endpointEntityName = 'ULDCargoBooking';


  constructor(http: HttpClient) {
    super(http);
  }

  create(cargoBookingRequest: CargoBookingRequest){
    return this.post<any>(this.endpointEntityName, cargoBookingRequest);
  }

}
