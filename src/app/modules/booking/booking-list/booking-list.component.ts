import { AccountService } from 'src/app/account/account.service';
import { CargoBooking } from './../../../_models/view-models/cargo-booking/cargo-booking.model';
import { Component, OnInit } from '@angular/core';
import { CargoBookingFilterQuery } from 'src/app/_models/queries/cargo-booking/cargo-booking-filter-query.model';
import { BookingService } from 'src/app/_services/booking.service';
import { Router } from '@angular/router';
import { BookingStatus } from 'src/app/core/enums/common-enums';
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
  filterFormHasValue = false
  totalCount: number = 0;
  bookingListfilterQuery: CargoBookingFilterQuery = new CargoBookingFilterQuery();
  bookingId?: string;
  destination?: string;
  bookingDate?: Date;
  cargoBookingList: CargoBooking[] = []
  cargoBookingId?: string;
  bookingStatus = BookingStatus;
  currentUser?: User | null;
  subscription?: Subscription;

  constructor(
    private bookingService: BookingService,
    private accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getFilteredList();
  }

  getFilteredList() {
    this.bookingListfilterQuery.bookingId = this.bookingId;
    this.bookingListfilterQuery.destination = this.destination;
    this.bookingListfilterQuery.bookingDate = this.bookingDate;
    this.bookingListfilterQuery.userId = this.currentUser?.id != null ? this.currentUser?.id : "";

    this.bookingService.getFilteredBookingList(this.bookingListfilterQuery).subscribe(
      {
        next: (res) => {
          this.cargoBookingList = res.data;
          this.totalCount = res.count;
        },
        error: () => {
          this.cargoBookingList = []
          this.totalCount = 0
        }
      }
    )
  }

  onChangeFilterFrm(event:any) {
      if ((this.bookingId !== undefined && this.bookingId !== "") ||
        (this.destination !== undefined && this.destination !== "") ||
        (this.bookingDate !== null)) {
        this.filterFormHasValue = true;
      } else {
        this.filterFormHasValue = false;
      }

  }

  show(id: any) {
    this.cargoBookingId = id;
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

  goToCreateBooking() {
    this.router.navigate(['booking/search']);
  }

  getBookingStatus(status: number): string {
    return CoreExtensions.GetBookingStatus(status)
  }

  clearFilter() {
    this.bookingId=undefined;
    this.destination=undefined;
    this.bookingDate=undefined;
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
}
