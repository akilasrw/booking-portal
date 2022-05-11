import { CargoBooking } from './../../../_models/view-models/cargo-booking/cargo-booking.model';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CargoBookingFilterQuery } from 'src/app/_models/queries/cargo-booking/cargo-booking-filter-query.model';
import { BookingService } from 'src/app/_services/booking.service';
import { Router } from '@angular/router';
import { BookingStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';


@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  filterFormHasValue = false

  public filterForm!: FormGroup;
  cargoBookingList: CargoBooking[] = []
  cargoBookingId?:string;
  bookingStatus = BookingStatus
  valuedd = "";

  constructor(
    private bookingService: BookingService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.initialiseForm();
    this.getFilteredList();
    this.onChangeFilterFrm();
  }

  initialiseForm(){
    this.filterForm = this.formBuilder.group({
      bookingId: new FormControl(null),
      destination: new FormControl(null),
      bookingDate: new FormControl(null),
    });
  }

  getFilteredList(){
    if(this.filterForm.valid){
      var qury: CargoBookingFilterQuery = this.filterForm.value;
      this.bookingService.getFilteredBookingList(qury).subscribe(
        res =>{
          this.cargoBookingList = res.data;
        }
      )
    }
  }

  onChangeFilterFrm(): void {
    this.filterForm.valueChanges.subscribe(item => {
      debugger
      if((item.bookingId !== null && item.bookingId.trim() !== "" ) || 
      (item.destination !== null && item.destination.trim() !== "" ) || 
      (item.bookingDate !== null)){
        this.filterFormHasValue = true;
      }else{
        this.filterFormHasValue = false;
      }      
    });
  }

  show(id:any) {
    this.cargoBookingId =id;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  hide() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  cancel() {
    this.hide();
  }

  closePopup(isSuccess: Boolean) {
    if (isSuccess) {
    }
    this.hide();
  }

  goToCreateBooking() {
    this.router.navigate(['booking/search']);
  }

  getBookingStatus(status:number):string{
    return CoreExtensions.GetBookingStatus(status)
  }

  clearFilter(){
    this.filterForm.reset();
    this.filterFormHasValue = false;
  }

}
