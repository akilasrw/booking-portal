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
import {CargoBooking} from "../../../_models/view-models/cargo-booking/cargo-booking.model";

@Component({
  selector: 'app-booking-view-detail',
  templateUrl: './booking-view-detail.component.html',
  styleUrls: ['./booking-view-detail.component.scss']
})
export class BookingViewDetailComponent implements OnInit {

  @Input() cargoBooking?: CargoBooking;
  cargoBookingDetail?: CargoBookingDetail
  modalVisible = false;
  modalVisibleAnimate = false;
  awbModel?: AWBCreateRM;
  subscription?: Subscription;
  currentUser?: User | null
  cargoAgent?:CargoAgent;
  pickedUpBoxes:PackageModel[] = [];
  wh_rec:PackageModel[] = [];
  dWh_rec:PackageModel[] = [];
  uld_packed:PackageModel[] = [];
  dispached:PackageModel[] = [];
  offloaded:PackageModel[] = [];
  uld_unpacked:PackageModel[] = [];
  delivered:PackageModel[] = [];
  dUld_packed:PackageModel[] = [];
  dDispached:PackageModel[] = [];
  dUld_unpacked:PackageModel[] = [];
  dDelivered:PackageModel[] = [];
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
    if (this.cargoBooking?.id != null) {



      this.bookingSerice.getPackageAuditStatus(this.cargoBooking.id).subscribe(
        (res:any) => {
          console.log(res)
          this.cargoBookingDetail= res
          this.pickedUpBoxes = res.filter((x:any)=> x.packageItemStatus == PackageItemStatus.Booking_Made)
          this.wh_rec = res.filter((x:any)=> x.packageItemStatus == PackageItemStatus.Cargo_Received)
          this.uld_packed = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.AcceptedForFlight)
          this.offloaded = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.Offloaded)
          this.uld_unpacked = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.InDestinationWarehouse)
          this.dispached = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.FlightDispatched)
          this.delivered = res.filter((x:PackageModel)=> x.packageItemStatus == PackageItemStatus.Delivered)
          this.dWh_rec = this.wh_rec.length >0 ? this.pickedUpBoxes.filter((x)=>  this.wh_rec.filter((y)=> y.packageID == x.packageID).length==0):[]
          this.dUld_packed = this.uld_packed.length >0 ? (this.wh_rec.filter((x)=>  this.uld_packed.filter((y)=> y.packageID == x.packageID).length==0)).filter((i)=> this.offloaded.filter((o)=> o.packageID == i.packageID).length == 0):[]
          this.dDispached = this.dispached.length>0 ? this.uld_packed.filter((x)=>  this.dispached.filter((y)=> y.packageID == x.packageID).length==0).filter((i)=> this.offloaded.filter((o)=> o.packageID == i.packageID).length == 0):[]
          this.dUld_unpacked =this.uld_unpacked.length>0? this.uld_packed.filter((x)=>  this.uld_unpacked.filter((y)=> y.packageID == x.packageID).length==0):[]
          this.dDelivered = this.delivered.length>0 ? this.uld_unpacked.filter((x)=>  this.delivered.filter((y)=> y.packageID == x.packageID).length==0):[]
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
    awb.cargoBookingId = this.cargoBooking?.id;
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

  public readonly BookingStatus = BookingStatus;
}
