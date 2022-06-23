import { AccountService } from 'src/app/account/account.service';
import { CargoBookingLookup } from './../../../_models/view-models/cargo-booking-lookup/cargo-booking-lookup.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CargoBookingLookupQuery } from 'src/app/_models/queries/cargo-booking-lookup/cargo-booking-lookup-query.model';
import { BookingLookupService } from 'src/app/_services/booking-lookup.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { ToastrService } from 'ngx-toastr';
import { BookingStatus, PackageItemStatus } from 'src/app/core/enums/common-enums';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from 'src/app/_models/user.model';


@Component({
  selector: 'app-booking-lookup-search',
  templateUrl: './booking-lookup-search.component.html',
  styleUrls: ['./booking-lookup-search.component.scss']
})
export class BookingLookupSearchComponent implements OnInit {

  public searchForm!:FormGroup;
  cargoBookingLookup?: CargoBookingLookup
  bookingStatus = BookingStatus;
  packageItemStatus = PackageItemStatus;
  subscription?: Subscription;
  currentUser?: User | null


  constructor(private fb:FormBuilder,
    private bookingLookupService: BookingLookupService,
    private accountService: AccountService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.initializeForm();
  }

  initializeForm(){
    this.searchForm = this.fb.group({
      referenceNumber: new FormControl(null)
    });
  }



  getBookingDetail(){
   
    if(this.searchForm.value.referenceNumber != null){
      var query = new CargoBookingLookupQuery;
      query.referenceNumber = this.searchForm.value.referenceNumber;
      query.isIncludeFlightDetail=true;
      query.isIncludePackageDetail=true;
      query.userId = this.currentUser?.id

      this.bookingLookupService.getBookingLookupDetail(query).subscribe(
        {
          next: (res) => {
            this.cargoBookingLookup = res;
          },
          error: (error) => {
            this.cargoBookingLookup = undefined;
          }
        });

    }else{
      this.toastr.error('Please enter booking number or package number.');
    }
    
  }

  getBookingStatus(status:number):string{
    return CoreExtensions.GetBookingStatus(status)
  }

  getPackageStatus(status:number):string{
    return CoreExtensions.GetPackageStatus(status)
  }

  GetFormattedAWBNumber(value: number): string {
    return value == 0? '-':CoreExtensions.PadLeadingZeros(value,8);
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

}
