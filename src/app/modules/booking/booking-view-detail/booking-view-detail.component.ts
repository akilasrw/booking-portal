import { CargoBookingDetail } from './../../../_models/view-models/cargo-booking/cargo-booking-detail/cargo-booking-detail.model';
import { CargoBookingDetailQuery } from './../../../_models/queries/cargo-booking/cargo-booking-detail-query.model';
import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from 'src/app/_services/booking.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { BookingStatus, PackageItemStatus } from 'src/app/core/enums/common-enums';
import { AWBCreateRM } from 'src/app/_models/request-models/awb/awb-create-rm.model';

@Component({
  selector: 'app-booking-view-detail',
  templateUrl: './booking-view-detail.component.html',
  styleUrls: ['./booking-view-detail.component.scss']
})
export class BookingViewDetailComponent implements OnInit {

  @Input() cargoBookingId?: string;
  cargoBookingDetail?: CargoBookingDetail
  modalVisible = false;
  modalVisibleAnimate = false;
  awbModel?:AWBCreateRM;


  constructor(private bookingSerice: BookingService) { }

  ngOnInit(): void {
    console.log(this.cargoBookingId);
    this.getBookingDetail()
  }


  getBookingDetail() {
    if (this.cargoBookingId != null) {
      var query = new CargoBookingDetailQuery;

      query.id = this.cargoBookingId;
      query.isIncludeFlightDetail = true;
      query.isIncludePackageDetail = true;

      this.bookingSerice.getBookingDetail(query).subscribe(
        res => {
          this.cargoBookingDetail = res;
        }
      );
    }
  }

  getBookingStatus(status: number): string {
    return CoreExtensions.GetBookingStatus(status)
  }

  GetFormattedAWBNumber(value: number): string {
    return value == 0 ? '-' : CoreExtensions.PadLeadingZeros(value, 8);
  }

  addAWBFromAddPackage(){
    this.awbModel = new AWBCreateRM();
    this.awbModel.isPackageUpdate = false;

    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  closeAWBForm() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  submitAWBDetail(awb: AWBCreateRM) {
    // awb.userId = this.currentUser?.id != null ? this.currentUser?.id : "";
    // this.awbDetail = awb;
    // if (this.awbModel != null && this.awbModel?.isPackageUpdate && this.selectedPackage != null && this.selectedPackageIndex != undefined) {
    //   this.selectedPackage.aWBDetail = awb;
    //   this.selectedPackage.packageItemStatus = PackageItemStatus.AddedAWB;
    //   this.cargoBookingRequest.packageItems?.splice(this.selectedPackageIndex!, 1, this.selectedPackage)
    // }
  }

  get bookingStatus(): typeof BookingStatus {
    return BookingStatus;
  }

  getPackageStatus(status: number): string {
    return CoreExtensions.GetPackageStatus(status)
  }

  get packageItemStatus(): typeof PackageItemStatus {
    return PackageItemStatus;
  }

}
