import { CargoBookingLookup } from './../../../_models/view-models/cargo-booking-lookup/cargo-booking-lookup.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CargoBookingLookupQuery } from 'src/app/_models/queries/cargo-booking-lookup/cargo-booking-lookup-query.model';
import { BookingLookupService } from 'src/app/_services/booking-lookup.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-booking-lookup-search',
  templateUrl: './booking-lookup-search.component.html',
  styleUrls: ['./booking-lookup-search.component.scss']
})
export class BookingLookupSearchComponent implements OnInit {

  public searchForm!:FormGroup;

  cargoBookingLookup?: CargoBookingLookup


  constructor(private fb:FormBuilder,
    private bookingLookupService: BookingLookupService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
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

      this.bookingLookupService.getBookingLookupDetail(query).subscribe(
        res =>{
          this.cargoBookingLookup = res;
        }
      ); 
    }else{
      this.toastr.error('Please enter booking number or package number.');
    }
    
  }

  bookingStatus(status:number):string{
    return CoreExtensions.GetBookingStatus(status)
  }

  packageStatus(status:number):string{
    return CoreExtensions.GetPackageStatus(status)
  }

}
