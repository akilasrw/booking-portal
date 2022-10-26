import { AWBStatus } from './../../../core/enums/common-enums';
import { AccountService } from 'src/app/account/account.service';
import { CargoBookingLookup } from './../../../_models/view-models/cargo-booking-lookup/cargo-booking-lookup.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CargoBookingLookupQuery } from 'src/app/_models/queries/cargo-booking-lookup/cargo-booking-lookup-query.model';
import { BookingLookupService } from 'src/app/_services/booking-lookup.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { ToastrService } from 'ngx-toastr';
import { BookingStatus, PackageItemStatus } from 'src/app/core/enums/common-enums';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from 'src/app/_models/user.model';
import { AWBDetail } from 'src/app/_models/view-models/awb/awb-detail.model';
import { BookingLookupPrintComponent } from '../booking-lookup-print/booking-lookup-print.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageItem } from 'src/app/_models/view-models/package-item.model';


@Component({
  selector: 'app-booking-lookup-search',
  templateUrl: './booking-lookup-search.component.html',
  styleUrls: ['./booking-lookup-search.component.scss'],
})
export class BookingLookupSearchComponent implements OnInit {

  public searchForm!: FormGroup;
  cargoBookingLookup?: CargoBookingLookup
  packageItemStatus = PackageItemStatus;
  subscription?: Subscription;
  currentUser?: User | null;
  awsPrintLookup?: AWBDetail;
  isPrinting: boolean = false;


  @ViewChild(BookingLookupPrintComponent) child !: any;

  constructor(private fb: FormBuilder,
    private bookingLookupService: BookingLookupService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.initializeForm();
  }

  initializeForm() {
    this.searchForm = this.fb.group({
      referenceNumber: new FormControl(null)
    });
  }

  getBookingDetail() {
    if (this.searchForm.value.referenceNumber != null) {
      var query = new CargoBookingLookupQuery;
      query.referenceNumber = this.searchForm.value.referenceNumber;
      query.isIncludeFlightDetail = true;
      query.isIncludePackageDetail = true;
      query.isIncludeAWBDetail = true;
      query.userId = this.currentUser?.id

      this.bookingLookupService.getBookingLookupDetail(query).subscribe(
        {
          next: (res) => {
            this.cargoBookingLookup = res;

            var packages = this.cargoBookingLookup.packageItems;
            this.cargoBookingLookup.packageItems = [];

            var filtered = packages.filter((value, index, self) =>
              index === self.findIndex((t) => (
                t.length === value.length && t.width === value.width && t.weight === value.weight
              ))
            )

            for (let i = 0; i < filtered.length; i++) {
              var count = 0;
              for (let j = 0; j < packages.length; j++) {
                if (filtered[i].length === packages[j].length && 
                  filtered[i].width === packages[j].width && 
                  filtered[i].height === packages[j].height) {
                  count += 1;
                }
              }
              filtered[i].pieces = count;
            }
            this.cargoBookingLookup.packageItems = filtered;
          },
          error: (error) => {
            this.cargoBookingLookup = undefined;
          }
        });
    } else {
      this.toastr.error('Please enter booking number or package number.');
    }
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

  generatePDF(cargoBookingLookup: CargoBookingLookup) {
    this.isPrinting = true;
    if (cargoBookingLookup.awbInformation !== undefined) {
      this.calculatePackageItemDetail(cargoBookingLookup.packageItems);
      this.spinner.show();
      console.log('generatePDF');
      this.child.printData(cargoBookingLookup.awbInformation);
      this.isPrinting = false;
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    }
  }

  calculatePackageItemDetail(packageItems: PackageItem[]){
    var noPieces:number=0
    var grossWeight:number=0
    var chargeableWeight : number=0
    packageItems.forEach(obj=>{
      if(obj != undefined && obj.pieces != undefined && obj.weight != undefined && obj.chargeableWeight != undefined ){
        noPieces += obj.pieces;
        grossWeight += obj.pieces * obj.weight;
        chargeableWeight += obj.pieces * obj.chargeableWeight; 
      }
    })
    this.cargoBookingLookup!.awbInformation!.packageItemCategory=packageItems[0].packageItemCategory;
    this.cargoBookingLookup!.awbInformation!.noOfPieces=noPieces;
    this.cargoBookingLookup!.awbInformation!.grossWeight=grossWeight;
    this.cargoBookingLookup!.awbInformation!.chargeableWeight=chargeableWeight;
    if(this.cargoBookingLookup!.awbInformation!.rateCharge != undefined){
      this.cargoBookingLookup!.awbInformation!.totalCharge = this.cargoBookingLookup!.awbInformation!.rateCharge *chargeableWeight;
    }
  }

  get awbStatus(): typeof AWBStatus {
    return AWBStatus;
  }

  get bookingStatus(): typeof BookingStatus {
    return BookingStatus;
  }
}
