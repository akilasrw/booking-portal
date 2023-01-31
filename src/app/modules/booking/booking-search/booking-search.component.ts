import { AircraftConfigType } from 'src/app/core/enums/common-enums';
import { Toast, ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { SelectList } from './../../../shared/models/select-list.model';
import { AirportService } from './../../../_services/airport.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingFilterListQuery } from 'src/app/_models/queries/booking-filter-list-query.model';
import { FlightScheduleService } from 'src/app/_services/flight-schedule.service';
import { FlightScheduleSector } from 'src/app/_models/view-models/flight-schedule-sectors/flight-schedule-sector.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightSchedule } from 'src/app/_models/view-models/flight-schedule/flight-schedule.model';

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
  flightSchedules: FlightSchedule[] = []
  flightScheduleSectorId: string = '';
  totalCount : number = 0;
  public showLoader = true;


  constructor(
    private flightScheduleService: FlightScheduleService,
    private airportService: AirportService,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private toastr:ToastrService,
    private activatedRoute: ActivatedRoute) {
    this.getId();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAirports();
  }

  getId() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookingFilterQuery = this.flightScheduleService.getCurrentFlightSchedule();
        this.flightScheduleSectorId = id;
        if (this.bookingFilterQuery) {
          if (this.bookingFilterQuery.scheduledDepartureDateTime)
            this.bookingFilterQuery.scheduledDepartureDateTime = new Date(this.bookingFilterQuery.scheduledDepartureDateTime);
          this.getFilteredList();
        }
      } else
        this.flightScheduleService.removeCurrentFlightSchedule();
    });
  }

  initializeForm() {
    this.bookingForm = this.fb.group({
      originAirportId: ['', [Validators.required]],
      destinationAirportId: ['', [Validators.required]],
      scheduledDepartureDateTime: ['', [Validators.required]],
    });
  }

  loadAirports() {
    this.showLoader=true
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
        this.showLoader=false
      },
      err => {
        this.showLoader=false
      }
     );
  }

  selectedOrigin(value: any) {
    this.bookingForm.get('originAirportId')?.patchValue(value.id);
  }

  onClearOrigin(){
    this.bookingForm.get('originAirportId')?.patchValue(null);
  }

  onChangeOrigin(){
    this.bookingForm.get('originAirportId')?.patchValue(null);
  }

  selectedDestination(value: any) {
    this.bookingForm.get('destinationAirportId')?.patchValue(value.id);
  }

  onClearDestination(){
    this.bookingForm.get('destinationAirportId')?.patchValue(null);
  }

  onChangeDestination(){
    this.bookingForm.get('destinationAirportId')?.patchValue(null);
  }

  submit() {
    if (this.isFormValied() && this.bookingForm.valid) {
      this.bookingFilterQuery.originAirportId = this.bookingForm.value.originAirportId;
      this.bookingFilterQuery.destinationAirportId = this.bookingForm.value.destinationAirportId;
      this.bookingFilterQuery.scheduledDepartureDateTime = this.bookingForm.value.scheduledDepartureDateTime;
      //this.bookingFilterQuery.pageSize =  3;
      this.flightSchedules = [];
      this.getFilteredList();
      this.flightScheduleSectorId = '';
    }else{
      this.flightSchedules = [];
      this.totalCount =0;
    }
  }

  isFormValied(): boolean {
    if ((this.bookingForm.get('originAirportId')?.value === null || this.bookingForm.get('originAirportId')?.value === "") ||
      (this.bookingForm.get('destinationAirportId')?.value === null || this.bookingForm.get('destinationAirportId')?.value === "")) {
      this.toastr.error('Please select origin and destination.');
      return false;
    }

    if (this.bookingForm.get('originAirportId')?.value === this.bookingForm.get('destinationAirportId')?.value) {
      this.toastr.error('Origin and destination is same.');
      return false;
    }
    
    if (this.bookingForm.get('scheduledDepartureDateTime')?.value === undefined || this.bookingForm.get('scheduledDepartureDateTime')?.value === "") {
      this.toastr.error('Please select flight date.');
      return false;
    }
    return true;
  }

 
  getFilteredList() {
    this.showLoader=true
    this.flightScheduleService.getFilteredList(this.bookingFilterQuery).subscribe(res => {
      if (res.count < 1) {
        this.toastrService.warning('No record found.');
        this.totalCount = res.count;
        this.flightSchedules = [];
      } else {
        this.flightSchedules = res.data;
        this.totalCount = res.count;
      }
      this.showLoader=false
    },
    err=>{
      this.showLoader=false
    });
  }

  setCurrentScheduleSector(){
    this.flightScheduleService.setCurrentFlightSchedule(this.bookingFilterQuery);
  }

  get aircraftConfigType(): typeof AircraftConfigType {
    return AircraftConfigType;
  }



}
