import { CargoBooking } from './../../../_models/view-models/cargo-booking/cargo-booking.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CargoBookingFilterQuery } from 'src/app/_models/queries/cargo-booking/cargo-booking-filter-query.model';
import { BookingService } from 'src/app/_services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;

  public filterForm!: FormGroup;
  cargoBookingList: CargoBooking[] = []
  cargoBookingId?:string;

  constructor(
    private bookingService: BookingService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.initialiseForm();
    this.getFilteredList();
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

}
