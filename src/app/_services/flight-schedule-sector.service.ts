import { FlightScheduleSectorQuery } from './../_models/queries/flight-schedule-sector/flight-schedule-sector-query.model';
import { CoreExtensions } from './../core/extensions/core-extensions.model';
import { BookingFilterListQuery } from './../_models/queries/booking-filter-list-query.model';
import { BookingListQuery } from 'src/app/_models/queries/booking-list-query.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { FlightScheduleSector } from '../_models/view-models/flight-schedule-sectors/flight-schedule-sector.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightScheduleSectorService extends BaseService {

  private currentFlightScheduleSource: BehaviorSubject<BookingFilterListQuery| null>;
  currentFlightSchedule$: Observable<BookingFilterListQuery| null>;

  private readonly endpointEntityName = 'flightScheduleSector';
  private readonly getFilteredListEndpoint: string = `${this.endpointEntityName}/getFilteredList`;


  constructor(http: HttpClient) {
    super(http);
    this.currentFlightScheduleSource = new BehaviorSubject<BookingFilterListQuery| null>(null);
    this.currentFlightSchedule$ = this.currentFlightScheduleSource.asObservable();
  }

  getFilteredList(query: BookingFilterListQuery) {
    var params = new HttpParams();
    if (query.originAirportId) {
      params = params.append("originAirportId", query.originAirportId);
    }

    if (query.destinationAirportId) {
      params = params.append("destinationAirportId", query.destinationAirportId);
    }

    if (query.scheduledDepartureDateTime) {
      params = params.append("scheduledDepartureDateTime", query.scheduledDepartureDateTime.toDateString());
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<FlightScheduleSector>>(
      this.getFilteredListEndpoint,
      params
    );
  }

  getFlightScheduleSector(query: FlightScheduleSectorQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }
    return this.getWithParams<FlightScheduleSector>(this.endpointEntityName,params);
  }

  setCurrentFlightScheduleSector(bookingFilterListQuery: BookingFilterListQuery) {
    sessionStorage.setItem('flightSchedule', JSON.stringify(bookingFilterListQuery));
    this.currentFlightScheduleSource.next(bookingFilterListQuery);
  }

  removeCurrentFlightScheduleSector() {
    sessionStorage.removeItem('flightSchedule');
    this.currentFlightScheduleSource.next(null);
  }

  getCurrentFlightScheduleSector() {
    const value = sessionStorage.getItem('flightSchedule');
    if (value && value != "null") {
      var res = JSON.parse(value) as BookingFilterListQuery;
      return  res;
    } else {
      return new BookingFilterListQuery();
    }
  }
}
