import { AccountService } from 'src/app/account/account.service';
import { CargoBooking } from './../../../_models/view-models/cargo-booking/cargo-booking.model';
import { Component, OnInit } from '@angular/core';
import { CargoBookingFilterQuery } from 'src/app/_models/queries/cargo-booking/cargo-booking-filter-query.model';
import { BookingService } from 'src/app/_services/booking.service';
import { Router } from '@angular/router';
import {BookingStatus, PackageItemStatus} from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  modalInfoVisible = false;
  modalInfoVisibleAnimate = false;
  filterFormHasValue = false
  totalCount: number = 0;
  bookingListfilterQuery: CargoBookingFilterQuery = new CargoBookingFilterQuery();
  bookingId?: string;
  destination?: string;
  fromDate?: Date;
  toDate?: Date;
  cargoBookingList: CargoBooking[] = []
  cargoBooking?: CargoBooking;
  cargoBookingId?: string;
  bookingStatus = PackageItemStatus;
  currentUser?: User | null;
  subscription?: Subscription;
  isLoading :boolean= false;
  redirectToTrackBooking: boolean=false;

  constructor(
    private bookingService: BookingService,
    private accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getFilteredList();
  }

  getFilteredList() {
    this.isLoading=true;
    this.bookingListfilterQuery.bookingId = this.bookingId;
    this.bookingListfilterQuery.destination = this.destination;
    this.bookingListfilterQuery.fromDate = this.fromDate;
    this.bookingListfilterQuery.toDate = this.toDate;
    this.bookingListfilterQuery.userId = this.currentUser?.id != null ? this.currentUser?.id : "";

    this.bookingService.getFilteredBookingList(this.bookingListfilterQuery).subscribe(
      {
        next: (res) => {
          res.data.forEach((x)=>{
            if(x.flightDate&&new Date(x.flightDate).getFullYear() == 1){
              x.flightDate = null
            }
          })
          this.cargoBookingList = res.data;
          this.totalCount = res.count;
          this.isLoading=false;
        },
        error: () => {
          this.cargoBookingList = [];
          this.totalCount = 0;
          this.isLoading=false;
        }
      }
    )
  }

  onChangeFilterFrm(event:any) {
      if ((this.bookingId !== undefined && this.bookingId !== "") ||
        (this.destination !== undefined && this.destination !== "") ||
        (this.fromDate !== null) || (this.toDate !== null)) {
        this.filterFormHasValue = true;
      } else {
        this.filterFormHasValue = false;
      }

  }

  show(booking:CargoBooking) {
    this.cargoBooking = booking;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  showInfo(booking:CargoBooking) {
    this.cargoBookingId = booking.id;
    this.modalInfoVisible = true;
    setTimeout(() => (this.modalInfoVisibleAnimate = true));
  }

  hide() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  cancel() {
    this.hide();
  }

  goToCreateBooking() {
    this.router.navigate(['booking/search']);
  }

  getBookingStatus(status: PackageItemStatus): string {
    return CoreExtensions.GetPackageStatus(status)
  }

  closeModel(){
    this.modalInfoVisible = false;
    this.modalInfoVisibleAnimate = false;
  }

  clearFilter() {
    this.bookingId=undefined;
    this.destination = undefined;
    this.fromDate = undefined;
    this.toDate = undefined;
    this.filterFormHasValue = false;
  }
  public onPageChanged(event: any) {
    if (this.bookingListfilterQuery?.pageIndex !== event) {
      this.bookingListfilterQuery.pageIndex = event;
      this.getFilteredList();
    }
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }
  showTrackBooking(awbNumber: any){
    // this.redirectToTrackBooking = true;
    console.log(awbNumber)
    this.router.navigate(['booking-lookup', awbNumber])
  }
}
