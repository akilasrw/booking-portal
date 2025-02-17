import { AwbService } from './../../../_services/awb.service';
import { AccountService } from 'src/app/account/account.service';
import { CargoBookingDetail } from './../../../_models/view-models/cargo-booking/cargo-booking-detail/cargo-booking-detail.model';
import { CargoBookingDetailQuery } from './../../../_models/queries/cargo-booking/cargo-booking-detail-query.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.scss']
})
export class BookingInfoComponent implements OnInit {

  @Input() cargoBookingId?: string;
  cargoBookingDetail?: CargoBookingDetail
  modalVisible = false;
  modalVisibleAnimate = false;
  awbModel?: AWBCreateRM;
  subscription?: Subscription;
  currentUser?: User | null
  packageForm?: FormGroup;
  packageList?:SelectList[];
  keyword = 'value';
  cargoAgent?:CargoAgent;
  selectedPackage?:SelectList;
  @Output() closePopup = new EventEmitter<any>();



  constructor(private bookingSerice: BookingService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private awbService: AwbService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getBookingDetail();
    this.packageForm = this.fb.group({
      width: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      length: ['', Validators.required],
      refNo: ['', Validators.required]
    });
  }

  onPackageChange(e:SelectList){
    let selectedPackage = this.cargoBookingDetail?.packageItems.find(x=> x.id == e.id)
    this.selectedPackage = e;
    let packageData = {
      width:selectedPackage?.width || 0,
      height:selectedPackage?.height || 0,
      weight:selectedPackage?.weight || 0,
      length: selectedPackage?.length || 0,
      refNo: selectedPackage?.packageRefNumber
    }

    this.packageForm?.patchValue(packageData);


  }


  onSubmit(): void {
    if (this.packageForm && this.packageForm.valid) {
      console.log('Form Submitted', this.packageForm.value);
      this.bookingSerice.updatePackage(this.packageForm.value, this.selectedPackage?.id || '').subscribe((x)=> {
        this.toastr.success("Package Update Succesfully")
        this.getBookingDetail();
      })
    } else {
      console.log('Form is invalid');
    }
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
          this.packageList = res.packageItems.map((x)=>{
            return{
                id:x.id,
                value:x.packageRefNumber
            }
          })
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
  closeModal(){
    this.closePopup.emit();
  }
  
  getCargoAgentDetails(userId:string){
    var query = new CargoAgentQuery();
    query.appUserId = userId;
    query.isCountryInclude=true;
    this.accountService.getUserDetail(query).subscribe(res => {
      this.cargoAgent = res;
    });
  }

  onDeletePackage(): void {
    // Check if the package status is AWB Added before deletion
    if (this.selectedPackage && this.cargoBookingDetail?.packageItems.find((x)=> x.id == this.selectedPackage?.id)?.packageItemStatus === PackageItemStatus.Booking_Made) {
      if (confirm('Are you sure you want to delete this package?')) {
        this.bookingSerice.deletePackage(this.selectedPackage?.id || '').subscribe({
          next: (res) => {
            this.toastr.success('Package successfully deleted.');
            this.getBookingDetail();
          },
          error: (err) => {
            this.toastr.error('Failed to delete package.');
          }
        });
      }
    } else {
      this.toastr.error('Package cannot be deleted unless AWB is added.');
    }
  }
}