import { CargoBookingDetail } from './../../../_models/view-models/cargo-booking/cargo-booking-detail/cargo-booking-detail.model';
import { CargoBookingDetailQuery } from './../../../_models/queries/cargo-booking/cargo-booking-detail-query.model';
import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from 'src/app/_services/booking.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';

@Component({
  selector: 'app-booking-view-detail',
  templateUrl: './booking-view-detail.component.html',
  styleUrls: ['./booking-view-detail.component.scss']
})
export class BookingViewDetailComponent implements OnInit {

  @Input() cargoBookingId?:string;
  cargoBookingDetail?: CargoBookingDetail

  constructor(private bookingSerice: BookingService) {}

  ngOnInit(): void {
    console.log(this.cargoBookingId);
    this.getBookingDetail()
  }


  getBookingDetail(){
    if(this.cargoBookingId != null){
      var query = new CargoBookingDetailQuery;

      query.id= this.cargoBookingId;
      query.isIncludeFlightDetail = true;
      query.isIncludePackageDetail = true;

      this.bookingSerice.getBookingDetail(query).subscribe(
        res =>{
          this.cargoBookingDetail = res;
        }
      );  
    }
  }

  bookingStatus(status:number):string{
    return CoreExtensions.GetBookingStatus(status)
  }

}
