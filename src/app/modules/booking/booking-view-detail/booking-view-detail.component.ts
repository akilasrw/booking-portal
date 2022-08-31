import { AwbService } from './../../../_services/awb.service';
import { AccountService } from 'src/app/account/account.service';
import { CargoBookingDetail } from './../../../_models/view-models/cargo-booking/cargo-booking-detail/cargo-booking-detail.model';
import { CargoBookingDetailQuery } from './../../../_models/queries/cargo-booking/cargo-booking-detail-query.model';
import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from 'src/app/_services/booking.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { AWBStatus, BookingStatus, PackageItemStatus } from 'src/app/core/enums/common-enums';
import { AWBCreateRM } from 'src/app/_models/request-models/awb/awb-create-rm.model';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user.model';
import { ToastrService } from 'ngx-toastr';
import { PackageItem } from 'src/app/_models/view-models/package-item.model';
import { CargoAgentQuery } from 'src/app/_models/queries/cargo-agent/cargo-agent-query.model';
import { CargoAgent } from 'src/app/_models/view-models/cargo-agent/cargo-agent.model';

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
  awbModel?: AWBCreateRM;
  subscription?: Subscription;
  currentUser?: User | null
  cargoAgent?:CargoAgent;



  constructor(private bookingSerice: BookingService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private awbService: AwbService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getBookingDetail();
  }


  getBookingDetail() {
    if (this.cargoBookingId != null) {
      var query = new CargoBookingDetailQuery;

      query.id = this.cargoBookingId;
      query.isIncludeFlightDetail = true;
      query.isIncludePackageDetail = true;
      query.isIncludeAWBDetail=true;
      query.userId = this.currentUser?.id;

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

  getAWBStatus(status:number):string{
    return CoreExtensions.GetAWBStatus(status)
  }

  GetFormattedAWBNumber(cargoBookingDetail: CargoBookingDetail): string {
    if(cargoBookingDetail != null && cargoBookingDetail.awbInformation != null && cargoBookingDetail.awbInformation.awbTrackingNumber != undefined){
      return cargoBookingDetail.awbInformation.awbTrackingNumber == 0? '-':CoreExtensions.PadLeadingZeros(cargoBookingDetail.awbInformation.awbTrackingNumber,8);
    }else{
      return '-';
    }
  }

  addAWB() {
    this.awbModel = new AWBCreateRM();
    this.awbModel.agentAccountNumber = this.cargoAgent?.cargoAccountNumber;
    this.awbModel.agentAITACode = this.cargoAgent?.agentIATACode;
    this.awbModel.agentCity = this.cargoAgent?.city;
    this.awbModel.agentName = this.cargoAgent?.agentName;
    this.awbModel.routingAndDestinationTo = this.cargoBookingDetail?.flightScheduleSector?.destinationAirportCode;
    this.awbModel.routingAndDestinationBy = this.cargoBookingDetail?.flightScheduleSector?.flightNumber.substring(0, 2);
    this.awbModel.requestedFlightDate = this.cargoBookingDetail?.flightScheduleSector?.scheduledDepartureDateTime;
    this.awbModel.destinationAirportName = this.cargoBookingDetail?.flightScheduleSector?.destinationAirportName;
    this.awbModel.destinationAirportId = this.cargoBookingDetail?.flightScheduleSector?.destinationAirportId;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  editAWB(cargoBookingDetail?:CargoBookingDetail) {
    if(cargoBookingDetail != null){
      this.awbModel = cargoBookingDetail!.awbInformation;
       this.awbModel!.isEditAWB = true;
       this.modalVisible = true;
       setTimeout(() => (this.modalVisibleAnimate = true));
    }
  }

  closeAWBForm() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  submitAWBDetail(awb: AWBCreateRM) {
    awb.userId = this.currentUser?.id != null ? this.currentUser?.id : "";
    awb.cargoBookingId = this.cargoBookingId;
    this.awbModel = awb;
    if (this.awbModel != null && this.awbModel?.isEditAWB) {
      this.awbService.update(this.awbModel).subscribe({
        next: (res) => {
          this.toastr.success('Successfully update AWB details.');
          this.getBookingDetail();
        },
        error: (err) => {
          this.toastr.error('Unable to update AWB details.');
        }
      });
    } else if (this.awbModel != null) {
      this.awbService.create(this.awbModel).subscribe({
        next: (res) => {
          this.toastr.success('Successfully add AWB details.');
          this.getBookingDetail();
        },
        error: (err) => {
          this.toastr.error('Unable to add AWB details.');
        }
      });
    }
  }

  get bookingStatus(): typeof BookingStatus {
    return BookingStatus;
  }
  get awbStatus(): typeof AWBStatus {
    return AWBStatus;
  }
  getPackageStatus(status: number): string {
    return CoreExtensions.GetPackageStatus(status)
  }

  get packageItemStatus(): typeof PackageItemStatus {
    return PackageItemStatus;
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
      if(this.cargoBookingDetail?.awbStatus != AWBStatus.AddedAWB ){
        this.getCargoAgentDetails(this.currentUser!.id);
      }
    });
  }
  
  getCargoAgentDetails(userId:string){
    var query = new CargoAgentQuery();
    query.appUserId = userId;
    query.isCountryInclude=true;
    this.accountService.getUserDetail(query).subscribe(res => {
      this.cargoAgent = res;
    });
  }
}
