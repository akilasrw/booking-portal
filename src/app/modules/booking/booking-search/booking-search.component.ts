import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { SelectList } from './../../../shared/models/select-list.model';
import { AirportService } from './../../../_services/airport.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingFilterListQuery } from 'src/app/_models/queries/booking-filter-list-query.model';
import { FlightScheduleSectorService } from 'src/app/_services/flight-schedule-sector.service';
import { FlightScheduleSector } from 'src/app/_models/view-models/flight-schedule-sectors/flight-schedule-sector.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-search',
  templateUrl: './booking-search.component.html',
  styleUrls: ['./booking-search.component.scss']
})
export class BookingSearchComponent implements OnInit {

  public bookingForm!: FormGroup;
  keyword = 'value';
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  bookingFilterQuery: BookingFilterListQuery = new BookingFilterListQuery();
  flightScheduleSectors: FlightScheduleSector[] = []
  flightScheduleSectorId: string = '';

  constructor(
      private flightScheduleSectorService: FlightScheduleSectorService,
      private airportService: AirportService,
      private fb: FormBuilder,
      private router: Router,
      private toastrService: ToastrService,
      private activatedRoute: ActivatedRoute) {
        this.getId();
      }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAirports();
  }

  getId() { debugger
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookingFilterQuery = this.flightScheduleSectorService.getCurrentFlightScheduleSector();
        this.flightScheduleSectorId = id;
        if(this.bookingFilterQuery) {
          if(this.bookingFilterQuery.scheduledDepartureDateTime)
            this.bookingFilterQuery.scheduledDepartureDateTime = new Date(this.bookingFilterQuery.scheduledDepartureDateTime);
          this.getFilteredList();
        }
      } else
        this.flightScheduleSectorService.removeCurrentFlightScheduleSector();
    });
  }

  initializeForm(){
    this.bookingForm = this.fb.group({
      originAirportId: ['', [Validators.required]],
      destinationAirportId: ['', [Validators.required]],
      scheduledDepartureDateTime: ['', [Validators.required]],
    });
  }

  loadAirports(){
    this.airportService.getSelectList()
      .subscribe(res => {
        if(res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
      });
  }

  selectedOrigin(value: any){
    this.bookingForm.get('originAirportId')?.patchValue(value.id);
  }

  selectedDestination(value: any){
    this.bookingForm.get('destinationAirportId')?.patchValue(value.id);
  }

  submit() {
    if(this.bookingForm.valid){
      this.bookingFilterQuery.originAirportId =  this.bookingForm.value.originAirportId;
      this.bookingFilterQuery.destinationAirportId =  this.bookingForm.value.destinationAirportId;
      this.bookingFilterQuery.scheduledDepartureDateTime =  this.bookingForm.value.scheduledDepartureDateTime;
      //this.bookingFilterQuery.pageSize =  3;
      this.getFilteredList();
      this.flightScheduleSectorId = '';
    }
  }

  getFilteredList(){
    this.flightScheduleSectorService.getFilteredList(this.bookingFilterQuery).subscribe(res => {
      if(res.count < 1){
        this.toastrService.warning('No record found.');
      } else {
          this.flightScheduleSectors = res.data;
      }
    });
  }

  goToBookingCreate(flightScheduleSector: FlightScheduleSector) {
    let id = flightScheduleSector.id;
    var recordCount = flightScheduleSector.flightScheduleSectorCargoPositions.filter(x=> x.availableSpaceCount > 0).length;
    if(recordCount > 0) {
      this.flightScheduleSectorService.setCurrentFlightScheduleSector(this.bookingFilterQuery);
      this.router.navigate(['booking/create', id]);
    }
    else
      this.toastrService.warning('No available space.');
  }

  validateSpace(flightScheduleSector: FlightScheduleSector): boolean{
    if(flightScheduleSector.flightScheduleSectorCargoPositions.filter(x=> x.availableSpaceCount > 0).length>0)
      return true;

    return false;
  }

  getAvailableCargoSpace(value: number) {
    let position: string ='';
    switch(value){
      case 1:
        position= "On Floor";
      break;
      case 2:
        position= "On Seat";
      break;
      case 3:
        position= "Under Seat";
      break;
      case 4:
        position= "Over head";
      break;

    }
    return position;
  }

}
