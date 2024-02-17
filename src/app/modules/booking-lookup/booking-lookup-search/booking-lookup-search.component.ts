import {AWBStatus, MenuType} from './../../../core/enums/common-enums';
import {AccountService} from 'src/app/account/account.service';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {CoreExtensions} from 'src/app/core/extensions/core-extensions.model';
import {ToastrService} from 'ngx-toastr';
import {BookingStatus, PackageItemStatus} from 'src/app/core/enums/common-enums';
import {Subscription} from 'rxjs/internal/Subscription';
import {User} from 'src/app/_models/user.model';
import {AWBDetail} from 'src/app/_models/view-models/awb/awb-detail.model';
import {BookingLookupPrintComponent} from '../booking-lookup-print/booking-lookup-print.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {BookingStatusEnum, CargoBooking} from 'src/app/_models/view-models/cargo-booking/cargo-booking.model';
import {BookingService} from "../../../_services/booking.service";
import {CargoBookingShipmentQuery} from "../../../_models/queries/booking-shipment/cargo-booking-shipment-query.model";
import {BookingShipment} from "../../../_models/view-models/booking-shipment/booking-shipment.model";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-booking-lookup-search',
  templateUrl: './booking-lookup-search.component.html',
  styleUrls: ['./booking-lookup-search.component.scss'],
})
export class BookingLookupSearchComponent implements OnInit {

  public searchForm!: FormGroup;
  public selectionForm!: FormGroup;
  cargoBookingLookup?: BookingShipment;
  cargoBookingShipmentList?: BookingShipment[] = [];
  subscription?: Subscription;
  currentUser?: User | null;
  isAWBChecked: boolean = false;
  packageItemCount = 0;
  packageStatus: number = 0;
  isSplitBooking: boolean = false;
  packageItemShipment: number = 0;
  awbnumber: string = '';


  @ViewChild(BookingLookupPrintComponent) child !: any;

  constructor(private fb: FormBuilder,
              private bookingService: BookingService,
              private accountService: AccountService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (null != id && id && id !="0") {
        this.awbnumber = id;
        this.getBookingDetail();
      }
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.initializeForm();
    this.initializeSelectionForm();
    this.selectionForm.get('packageItemShipment')?.valueChanges?.subscribe(value => {
      this.getShipmentDetail(value);
    });
    const screenWidth = window.innerWidth - 315;
    const rowElement = document.querySelector('.awb_checked') as HTMLElement;
    if (rowElement) {
      rowElement.style.width = screenWidth + 'px';
    }

  }

  initializeForm() {
    this.searchForm = this.fb.group({
      referenceNumber: new FormControl(null)
    });
  }

  initializeSelectionForm() {
    this.selectionForm = this.fb.group({
      packageItemShipment: -1
    });
  }

  check() {
    this.isAWBChecked = !this.isAWBChecked

  }

  getBookingDetail() {
    if ( this.awbnumber != '') {
      var query = new CargoBookingShipmentQuery();
      if (this.isAWBChecked) {
        query.packageID = this.searchForm.value.referenceNumber;
      } else if(this.awbnumber != ''){
        query.AWBNumber = this.awbnumber;
      } else {
        query.AWBNumber = this.searchForm.value.referenceNumber;
      }

      this.bookingService.getBookingShipmentDetail(query).subscribe(
        {
          next: (res) => {
            this.cargoBookingShipmentList = res;
            if (null != this.cargoBookingShipmentList && this.cargoBookingShipmentList.length > 0) {
              if (this.cargoBookingShipmentList?.length > 1) {
                this.isSplitBooking = true;
              } else {
                this.cargoBookingLookup = this.cargoBookingShipmentList[0];
              }
            }
          },
          error: (error) => {
            this.cargoBookingLookup = undefined;
          }
        });
    } else {
      this.toastr.error('Please enter booking number or package number.');
    }
  }

  getStatus(e: number): string {
    return BookingStatusEnum[e]
  }

  getBookingStatus(status: number): string {
    return CoreExtensions.GetBookingStatus(status)
  }

  getAWBStatus(status: number): string {
    return CoreExtensions.GetAWBStatus(status)
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  getShipmentDetail(selectedShipment: BookingShipment) {
    this.cargoBookingLookup = selectedShipment;
  }

  get awbStatus(): typeof AWBStatus {
    return AWBStatus;
  }

  get bookingStatus(): typeof BookingStatus {
    return BookingStatus;
  }

  // getPackageStatus(bookingStatus?: PackageItemStatus) {
  //   switch (bookingStatus) {
  //     case PackageItemStatus.Booking_Made:
  //       this.packageStatus = 1;
  //       break;
  //     case PackageItemStatus.Cargo_Received:
  //       this.packageStatus = 2;
  //       break;
  //     case PackageItemStatus.AcceptedForFLight:
  //       this.packageStatus = 4;
  //       break;
  //     case PackageItemStatus.Dispatched:
  //       this.packageStatus = 5;
  //       break;
  //     case PackageItemStatus.Arrived:
  //       this.packageStatus = 6;
  //       break;
  //     case PackageItemStatus.IndestinationWarehouse:
  //       this.packageStatus = 7;
  //       break;
  //     case PackageItemStatus.TruckForDelivery:
  //       this.packageStatus = 8;
  //       break;
  //     case PackageItemStatus.Deliverd:
  //       this.packageStatus = 9;
  //       break;
  //   }
  // }
}
