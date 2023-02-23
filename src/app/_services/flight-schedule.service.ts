import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BookingFilterListQuery } from '../_models/queries/booking-filter-list-query.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlightSchedule } from '../_models/view-models/flight-schedule/flight-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class FlightScheduleService extends BaseService {

  private currentFlightScheduleSource: BehaviorSubject<BookingFilterListQuery| null>;
  currentFlightSchedule$: Observable<BookingFilterListQuery| null>;

  private readonly endpointEntityName = 'flightSchedule';
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

    return this.getWithParams<IPagination<FlightSchedule>>(
      this.getFilteredListEndpoint,
      params
    );
  }



  setCurrentFlightSchedule(bookingFilterListQuery: BookingFilterListQuery) {
    sessionStorage.setItem('flightSchedule', JSON.stringify(bookingFilterListQuery));
    this.currentFlightScheduleSource.next(bookingFilterListQuery);
  }

  removeCurrentFlightSchedule() {
    sessionStorage.removeItem('flightSchedule');
    this.currentFlightScheduleSource.next(null);
  }

  getCurrentFlightSchedule() {
    const value = sessionStorage.getItem('flightSchedule');
    if (value && value != "null") {
      var res = JSON.parse(value) as BookingFilterListQuery;
      return  res;
    } else {
      return new BookingFilterListQuery();
    }
  }
}
