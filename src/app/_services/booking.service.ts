import { CargoBooking } from './../_models/view-models/cargo-booking/cargo-booking.model';
import { CoreExtensions } from './../core/extensions/core-extensions.model';
import { BookingFilterListQuery } from './../_models/queries/booking-filter-list-query.model';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { CargoBookingFilterQuery } from '../_models/queries/cargo-booking/cargo-booking-filter-query.model';
import { CargoBookingDetailQuery } from '../_models/queries/cargo-booking/cargo-booking-detail-query.model';
import { CargoBookingDetail } from '../_models/view-models/cargo-booking/cargo-booking-detail/cargo-booking-detail.model';
import { CargoBookingRequest } from '../_models/view-models/cargo-booking/cargo-booking-request.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {


  private readonly endpointEntityName = 'cargoBooking';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/getFilteredList`;


  constructor(http: HttpClient) {
    super(http);
  }

  getFilteredBookingList(query: CargoBookingFilterQuery){
    var params = new HttpParams();
    if (query.bookingId) {
      params = params.append("bookingId", query.bookingId);
    }

    if (query.destination) {
      params = params.append("destination", query.destination);
    }

    if (query.bookingDate) {
      params = params.append("bookingDate", query.bookingDate.toDateString());
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<CargoBooking>>(
      this.getFilteredListEndpoint,
      params
    );
  }


  getBookingDetail(query: CargoBookingDetailQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }

    if (query.isIncludeFlightDetail) {
      params = params.append("isIncludeFlightDetail", query.isIncludeFlightDetail);
    }

    if (query.isIncludePackageDetail) {
      params = params.append("isIncludePackageDetail", query.isIncludePackageDetail);
    }
    return this.getWithParams<CargoBookingDetail>(this.endpointEntityName,params);
  }

  create(cargoBookingRequest: CargoBookingRequest){
    return this.post<any>(this.endpointEntityName, cargoBookingRequest);
  }

}
