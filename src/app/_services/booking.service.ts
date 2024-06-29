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
import { CargoBookingRequest, PackageDetailsUpdateRM } from '../_models/view-models/cargo-booking/cargo-booking-request.model';
import {CargoBookingShipmentQuery} from "../_models/queries/booking-shipment/cargo-booking-shipment-query.model";
import {CargoBookingLookupQuery} from "../_models/queries/cargo-booking-lookup/cargo-booking-lookup-query.model";
import {CargoBookingLookup} from "../_models/view-models/cargo-booking-lookup/cargo-booking-lookup.model";
import {BookingShipment} from "../_models/view-models/booking-shipment/booking-shipment.model";

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {


  private readonly endpointEntityName = 'cargoBooking';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/getFilteredList`;
  private readonly getShipmentListEndpoint = `${this.endpointEntityName}/getShipments`;


  constructor(http: HttpClient) {
    super(http);
  }

  getFilteredBookingList(query: CargoBookingFilterQuery){
    var params = new HttpParams();
    // if (query.bookingId) {
    //   params = params.append("bookingId", query.bookingId);
    // }
    if (query.bookingId) {
      params = params.append("awbNumber", query.bookingId);
    }
    if (query.userId) {
      params = params.append("userId", query.userId);
    }

    if (query.destination) {
      params = params.append("destination", query.destination);
    }

    if (query.fromDate) {
      params = params.append("fromDate", query.fromDate.toDateString());
    }
    if (query.toDate) {
      params = params.append("toDate", query.toDate.toDateString());
    }
    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<CargoBooking>>(
      this.getFilteredListEndpoint,
      params
    );
  }

  getPackageAuditStatus(bookingId:string){
   return this.get(`Package/AuditByBooking?bookingID=${bookingId}`)
  }


  getBookingDetail(query: CargoBookingDetailQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
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

    return this.getWithParams<CargoBookingDetail>(this.endpointEntityName,params);
  }

  create(cargoBookingRequest: CargoBookingRequest){
    return this.post<any>(this.endpointEntityName, cargoBookingRequest);
  }
  updatePackage(packageDetails: PackageDetailsUpdateRM, id:string){
    return this.put<any>(`Package/UpdateDetails/${id}`, packageDetails);
  }

  getBookingShipmentDetail(query: CargoBookingShipmentQuery) {
    var params = new HttpParams();
    if (query.packageID) {
      params = params.append("packageID", query.packageID);
    }

    if (query.AWBNumber) {
      params = params.append("AWBNumber", query.AWBNumber);
    }
    return this.getWithParams<Array<BookingShipment>>(this.getShipmentListEndpoint,params);
  }

}
