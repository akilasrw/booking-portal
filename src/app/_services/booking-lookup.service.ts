import { BaseService } from './../core/services/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CargoBookingLookupQuery } from '../_models/queries/cargo-booking-lookup/cargo-booking-lookup-query.model';
import { CargoBookingLookup } from '../_models/view-models/cargo-booking-lookup/cargo-booking-lookup.model';

@Injectable({
  providedIn: 'root'
})
export class BookingLookupService extends BaseService {

  private readonly endpointEntityName = 'cargoBookingLookup';

  constructor(http:HttpClient) { 
    super(http)
  }

  getBookingLookupDetail(query: CargoBookingLookupQuery) {
    var params = new HttpParams();
    if (query.referenceNumber) {
      params = params.append("referenceNumber", query.referenceNumber);
    }

    if (query.AWBNumber) {
      params = params.append("AWBNumber", query.AWBNumber);
    }

    if (query.userId) {
      params = params.append("userId", query.userId);
    }

    if (query.isIncludeFlightDetail) {
      params = params.append("isIncludeFlightDetail", query.isIncludeFlightDetail);
    }

    if (query.isIncludePackageDetail) {
      params = params.append("isIncludePackageDetail", query.isIncludePackageDetail);
    }

    if (query.isIncludeAWBDetail) {
      params = params.append("isIncludeAWBDetail", query.isIncludeAWBDetail);
    }
    
    return this.getWithParams<CargoBookingLookup>(this.endpointEntityName,params);
  }

}
