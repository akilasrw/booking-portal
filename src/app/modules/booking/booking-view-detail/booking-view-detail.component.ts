import { AwbService } from './../../../_services/awb.service';
import { AccountService } from 'src/app/account/account.service';
import { CargoBookingDetail } from './../../../_models/view-models/cargo-booking/cargo-booking-detail/cargo-booking-detail.model';
import { CargoBookingDetailQuery } from './../../../_models/queries/cargo-booking/cargo-booking-detail-query.model';
import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from 'src/app/_services/booking.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { AWBStatus, BookingStatus, PackageItemStatus } from 'src/app/core/enums/common-enums';
import { AWBCreateRM } from 'src/app/_models/request-models/awb/awb-create-rm.model';
import {PackageModel} from "../../../_models/view-models/package-container/package-model";
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
  pickedUpBoxes?:PackageModel[] = [];
  wh_rec?:PackageModel[] = [];
  dWh_rec?:PackageModel[] = [];
  uld_packed?:PackageModel[] = [];
  offloaded?:PackageModel[] = [];
  uld_unpacked?:PackageModel[] = [];
  delivered?:PackageModel[] = [];
  dUld_packed?:PackageModel[] = [];
  dOffloaded?:PackageModel[] = [];
  dUld_unpacked?:PackageModel[] = [];
  dDelivered?:PackageModel[] = [];
  openList?:string | null = null



  constructor(private bookingSerice: BookingService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private awbService: AwbService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getBookingDetail();
  }

  setOpenList(x:string){
    if(x == this.openList){
      this.openList = null
    }else{
      this.openList = x
    }
  }

  getBookingDetail() {
    if (this.cargoBookingId != null) {



      this.bookingSerice.getPackageAuditStatus(this.cargoBookingId).subscribe(
        (res:any) => {
          console.log(res)
          this.cargoBookingDetail= res
          this.pickedUpBoxes = res.filter((x:any)=> x.packageItemStatus == PackageItemStatus.Booking_Made)
          this.wh_rec = res.filter((x:any)=> x.packageItemStatus == PackageItemStatus.Cargo_Received)
          this.dWh_rec = (this?.pickedUpBoxes || []).filter((x)=>  !(this.wh_rec || []).includes(x))
          this.dUld_packed = (this?.pickedUpBoxes || []).filter((x)=>  !(this.uld_packed || []).includes(x))
          this.dUld_unpacked = (this?.pickedUpBoxes || []).filter((x)=>  !(this.uld_unpacked || []).includes(x))
          this.dOffloaded = (this?.pickedUpBoxes || []).filter((x)=>  !(this.offloaded || []).includes(x))
          this.dDelivered = (this?.pickedUpBoxes || []).filter((x)=>  !(this.delivered || []).includes(x))
          this.uld_packed = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.AcceptedForFlight)
          this.offloaded = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.Offloaded)
          this.uld_unpacked = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.InDestinationWarehouse)
          this.delivered = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.Delivered)
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

  addAWB() {
    this.awbModel = new AWBCreateRM();
    this.awbModel.agentAccountNumber = this.cargoAgent?.cargoAccountNumber;
    this.awbModel.agentAITACode = this.cargoAgent?.agentIATACode;
    this.awbModel.agentCity = this.cargoAgent?.city;
    this.awbModel.agentName = this.cargoAgent?.agentName;
     this.awbModel.routingAndDestinationTo = this.cargoBookingDetail?.destinationAirportCode;
    this.awbModel.routingAndDestinationBy = this.cargoBookingDetail?.flightNumber.substring(0, 2);
    this.awbModel.requestedFlightDate = this.cargoBookingDetail?.scheduledDepartureDateTime;
    this.awbModel.destinationAirportName = this.cargoBookingDetail?.destinationAirportName;
    this.awbModel.destinationAirportId = this.cargoBookingDetail?.destinationAirportId;
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
