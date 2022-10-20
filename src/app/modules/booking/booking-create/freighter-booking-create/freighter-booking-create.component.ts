import { CargoAgentQuery } from './../../../../_models/queries/cargo-agent/cargo-agent-query.model';
import { ToastrService } from 'ngx-toastr';
import { FlightScheduleSectorService } from 'src/app/_services/flight-schedule-sector.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageContainer } from 'src/app/_models/view-models/package-container/package-container.model';
import { PackageContainerListQuery } from 'src/app/_models/queries/package-container/package-container-list-query.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { CargoBookingRequest } from 'src/app/_models/view-models/cargo-booking/cargo-booking-request.model';
import { AWBStatus, BookingStatus, PackageContainerType, PackageItemStatus, PackagePriorityType, UnitType } from 'src/app/core/enums/common-enums';
import { UnitService } from 'src/app/_services/unit.service';
import { FlightScheduleSector } from 'src/app/_models/view-models/flight-schedule-sectors/flight-schedule-sector.model';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { Constants } from 'src/app/core/constants/constants';
import { FlightScheduleSectorQuery } from 'src/app/_models/queries/flight-schedule-sector/flight-schedule-sector-query.model';
import { PackageContainerService } from 'src/app/_services/package-container.service';
import { PackageItem } from 'src/app/_models/view-models/package-item.model';
import { Unit } from 'src/app/_models/view-models/unit/unit.model';
import { ValidateCargoPositionRequest } from 'src/app/_models/request-models/cargo-booking/validate-cargo-position-request.model';
import { AWBCreateRM } from 'src/app/_models/request-models/awb/awb-create-rm.model';
import { UldCargoPositionService } from 'src/app/_services/uld-cargo-position.service';
import { UldCargoBookingService } from 'src/app/_services/uld-cargo-booking.service';
import { CargoAgent } from 'src/app/_models/view-models/cargo-agent/cargo-agent.model';

@Component({
  selector: 'app-freighter-booking-create',
  templateUrl: './freighter-booking-create.component.html',
  styleUrls: ['./freighter-booking-create.component.scss']
})
export class FreighterBookingCreateComponent implements OnInit {
  modalVisible = false;
  modalVisibleAnimate = false;
  flightScheduleSectorId!: string;
  flightScheduleSector?: FlightScheduleSector;
  packageContainers?: PackageContainer[] = [];
  cargoAgent?:CargoAgent;
  bookingForm!: FormGroup;
  cargoBookingRequest!: CargoBookingRequest;
  volumeUnits: Unit[] = [];
  weightUnits: Unit[] = [];
  disableInput: boolean = true;
  currentUser?: User | null
  subscription?: Subscription;
  awbDetail?: AWBCreateRM;



  constructor(private activatedRoute: ActivatedRoute,
    private flightScheduleSectorService: FlightScheduleSectorService,
    private packageContainerService: PackageContainerService,
    private uldCargoBookingService: UldCargoBookingService,
    private accountService: AccountService,
    private uldCargoPositionService: UldCargoPositionService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private unitService: UnitService,
    private router: Router) {
    this.getId();
    this.cargoBookingRequest = new CargoBookingRequest();
  }

  ngOnInit(): void {
    this.createForm();
    this.getCurrentUser();
    this.getUnits();

    this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.valueChanges.subscribe(x => {
      this.disableInput = false;
      var query = new PackageContainerListQuery();
      query.packageItemType = x;
      this.getPackageContainers(query);
    });
  }

  getUnits() {
    this.unitService.getList()
      .subscribe(res => {
        console.log("units: ", res);
        this.weightUnits = res.filter(x => x.unitType == UnitType.Mass);
        this.volumeUnits = res.filter(x => x.unitType == UnitType.Length);
      });
  }

  patchPackageDimentions(container: PackageContainer) {
    this.bookingForm.get('packageItems')?.get('width')?.patchValue(container.width);
    this.bookingForm.get('packageItems')?.get('height')?.patchValue(container.height);
    this.bookingForm.get('packageItems')?.get('length')?.patchValue(container.length);
  }

  createForm() {
    this.bookingForm = this.fb.group({
      flightScheduleSectorId: [''],
      packageItems: this.fb.group({
        id: [''],
        width: [0, [Validators.required, Validators.min(1)]],
        length: [0, [Validators.required, Validators.min(1)]],
        weight: [0, [Validators.required, Validators.min(1)]],
        height: [0, [Validators.required, Validators.min(1)]],
        packageItemCategory: [],
        weightUnitId: ['bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c', [Validators.required]],
        volumeUnitId: ['9f0928df-5d33-4e5d-affc-f7e2e2b72680', [Validators.required]],
        packageItemStatus: [PackageItemStatus.Pending],
        description: [''],
        isEdit: [false],
        pieces:[1,[Validators.required, Validators.min(1)]]
      }),
    })
  }

  getId() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.flightScheduleSectorId = id;
        this.getFlightScheduleSectorData();
      }
    });
  }

  getFlightScheduleSectorData() {
    var query: FlightScheduleSectorQuery = {
      id: this.flightScheduleSectorId,
      includeLoadPlan: false
    };

    this.flightScheduleSectorService.getFlightScheduleSector(query)
      .subscribe(res => {
        this.flightScheduleSector = res;
      });
  }

  getPackageContainers(query: PackageContainerListQuery) {
    this.packageContainerService.getList(query).subscribe(res => {
      this.packageContainers = res;
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

  async add() {
    if (this.isBookingFormValied()&& this.bookingForm.valid) {
      var booking = this.bookingForm.value;
      if (this.isVolumeNotExceed() == true) {
        if (await this.isWeightAndVolumeNotExceed(booking.packageItems) == true) {
          if (this.cargoBookingRequest.packageItems == undefined) {
            this.cargoBookingRequest = {
              flightScheduleSectorId: this.flightScheduleSectorId,
              packageItems: [this.mapPackageItems(booking.packageItems)]
            };
          } else if (this.cargoBookingRequest.packageItems?.findIndex(x => x.height == booking.height && x.length == booking.length && x.width == booking.width) == -1) {
            this.cargoBookingRequest.packageItems?.push(this.mapPackageItems(booking.packageItems));
          } else {
            this.toastr.warning('Package is already exists.');
          }

          console.log(this.cargoBookingRequest);
          this.resetForm();
          this.bookingForm.markAsUntouched();
        }
      }
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  isBookingFormValied():boolean{
    
    if (this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.value === null || 
    this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.value === "") {
      this.toastr.error('Please select cargo type.');
      return false;
    }

    return true;
  }

  editPackage(packageItem: PackageItem) {
    this.bookingForm.get('packageItems')?.get('width')?.patchValue(packageItem.width);
    this.bookingForm.get('packageItems')?.get('length')?.patchValue(packageItem.length);
    this.bookingForm.get('packageItems')?.get('weight')?.patchValue(packageItem.weight);
    this.bookingForm.get('packageItems')?.get('height')?.patchValue(packageItem.height);
    this.bookingForm.get('packageItems')?.get('weightUnitId')?.patchValue(packageItem.weightUnitId);
    this.bookingForm.get('packageItems')?.get('volumeUnitId')?.patchValue(packageItem.volumeUnitId);
    this.bookingForm.get('packageItems')?.get('isEdit')?.patchValue(true);
    this.bookingForm.get('packageItems')?.get('pieces')?.patchValue(packageItem.pieces);
  }

  resetForm() {
    this.bookingForm.get('packageItems')?.get('width')?.patchValue(0);
    this.bookingForm.get('packageItems')?.get('length')?.patchValue(0);
    this.bookingForm.get('packageItems')?.get('weight')?.patchValue(0);
    this.bookingForm.get('packageItems')?.get('height')?.patchValue(0);
    this.bookingForm.get('packageItems')?.get('packageItemStatus')?.patchValue(PackageItemStatus.Pending);
    this.bookingForm.get('packageItems')?.get('description')?.patchValue('');
    this.bookingForm.get('packageItems')?.get('isEdit')?.patchValue(false);
    this.bookingForm.get('packageItems')?.get('weightUnitId')?.patchValue('bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c');
    this.bookingForm.get('packageItems')?.get('volumeUnitId')?.patchValue('9f0928df-5d33-4e5d-affc-f7e2e2b72680');
    this.bookingForm.get('packageItems')?.get('pieces')?.patchValue(1);
    this.awbDetail = undefined;
  }

  mapPackageItems(packageItem: any) {
    return {
      height: Number(packageItem.height),
      length: Number(packageItem.length),
      weight: CoreExtensions.RoundToTwoDecimalPlaces(Number(packageItem.weight)),
      width: Number(packageItem.width),
      packagePriorityType: PackagePriorityType.None,
      packageItemCategory: Number(packageItem.packageItemCategory),
      weightUnitId: packageItem.weightUnitId,
      volumeUnitId: packageItem.volumeUnitId,
      packageItemStatus: Number(PackageItemStatus.Pending),
      description: packageItem.description,
      packageContainerType: PackageContainerType.OnFloor,
      isEdit: packageItem.isEdit,
      pieces: packageItem.pieces,
      aWBDetail: this.awbDetail,
      chargeableWeight: this.getChargeableWeight(
        { weight: CoreExtensions.RoundToTwoDecimalPlaces(Number(packageItem.weight)),
          length: Number(packageItem.length),width: Number(packageItem.width),
          height:Number(packageItem.height),volumeUnitId: packageItem.volumeUnitId}),
    };
  }

  isVolumeNotExceed(){
    var selectedVolumeUnitId = this.bookingForm.get('packageItems')?.get('volumeUnitId')?.value;
    var selectedLength = this.bookingForm.get('packageItems')?.get('length')?.value;
    var selectedWidth = this.bookingForm.get('packageItems')?.get('width')?.value;
    var selectedHeight = this.bookingForm.get('packageItems')?.get('height')?.value;
    if(selectedVolumeUnitId === Constants.CM_VOLUME_UNIT_ID.toLowerCase()){
      if(selectedLength> 318){
        this.toastr.warning('Max length volume (318cm) exceed.');
        return false;
      }
      if(selectedWidth> 224){
        this.toastr.warning('Max width volume (224cm) exceed.');
        return false;
      }
      if(selectedHeight> 163){
        this.toastr.warning('Max height volume (163cm) exceed.');
        return false;
      }
    }else if(selectedVolumeUnitId === Constants.METER_VOLUME_UNIT_ID.toLowerCase()){
      if(selectedLength> 3.18){
        this.toastr.warning('Max length volume (3.18m) exceed.');
        return false;
      }
      if(selectedWidth> 2.24){
        this.toastr.warning('Max width volume (2.24m) exceed.');
        return false;
      }
      if(selectedHeight> 1.63){
        this.toastr.warning('Max height volume (1.63m) exceed.');
        return false;
      }
    }else if(selectedVolumeUnitId === Constants.INCH_VOLUME_UNIT_ID.toLowerCase()){
      if(selectedLength> 125){
        this.toastr.warning('Max length volume (125inch) exceed.');
        return false;
      }
      if(selectedWidth> 88){
        this.toastr.warning('Max width volume (88inch) exceed.');
        return false;
      }
      if(selectedHeight> 64){
        this.toastr.warning('Max height volume (64inch) exceed.');
        return false;
      }
    }
    return true;
  }

  async isWeightAndVolumeNotExceed(cargoPackage: PackageItem) {
    var request: ValidateCargoPositionRequest = {
      packageItem: this.mapPackageItems(cargoPackage),
      flightScheduleSectorId: this.flightScheduleSectorId
    };

    request.packageItem.length = request.packageItem.length!*cargoPackage.pieces!;
    request.packageItem.width = request.packageItem.width!*cargoPackage.pieces!;
    request.packageItem.height = request.packageItem.height!*cargoPackage.pieces!;
    request.packageItem.weight = request.packageItem.weight!*cargoPackage.pieces!;

    var response = await this.uldCargoPositionService.validateWeightAndVolume(request).toPromise();
   
    if (response !== undefined) {
      if (!response.isValid) {
        this.toastr.error(response.validationMessage);
      }
      return response.isValid;
    } else {
      return false;
    }
  }

  getPackageDimentions(packageContainer: any) {
    return CoreExtensions.GetPackageDimentions(packageContainer.length, packageContainer.width, packageContainer.height);
  }

  getPackageWeight(packageItem:PackageItem){
    if(Constants.BASE_WEIGHT_UNIT_ID.toLowerCase()== packageItem.weightUnitId){
      var totalWeight = packageItem.weight! * packageItem.pieces!;
      return totalWeight;
    }else{
      var weight =CoreExtensions.GramToKilogramConversion(packageItem.weight!);
      var totalWeight = weight * packageItem.pieces!;
      return totalWeight;
    }
  }

  getChargeableWeight(packageItem:PackageItem){
    var chargeableWeight = 0;
    var actualChargeableWeight= 0;

    if(Constants.BASE_WEIGHT_UNIT_ID.toLowerCase()!= packageItem.weightUnitId){
      var weight =CoreExtensions.GramToKilogramConversion(packageItem.weight!);
      packageItem.weight = weight
    }

    if(Constants.CM_VOLUME_UNIT_ID.toLowerCase()== packageItem.volumeUnitId){
      chargeableWeight = ((packageItem.width! * packageItem.length! * packageItem.height!)/1000000)*167;
      actualChargeableWeight = packageItem.weight!>chargeableWeight? packageItem.weight!: chargeableWeight;
    }else if(Constants.INCH_VOLUME_UNIT_ID.toLowerCase()== packageItem.volumeUnitId){
      chargeableWeight = ((packageItem.width! * packageItem.length! * packageItem.height!)/61023.7)*167;
      actualChargeableWeight = packageItem.weight!>chargeableWeight? packageItem.weight! : chargeableWeight;
    }else if(Constants.METER_VOLUME_UNIT_ID.toLowerCase()== packageItem.volumeUnitId){
      chargeableWeight = (packageItem.width! * packageItem.length! * packageItem.height!)*167;
      actualChargeableWeight = packageItem.weight!>chargeableWeight? packageItem.weight! : chargeableWeight;
    }
    return CoreExtensions.RoundToTwoDecimalPlaces(Number(actualChargeableWeight))
  }

  getChargeableWeightTotal(packageItem:PackageItem){

    var chargeableWeight = 0;
    var chargeableWeightTotal= 0;
    
    if(Constants.BASE_WEIGHT_UNIT_ID.toLowerCase()!= packageItem.weightUnitId){
      var weight =CoreExtensions.GramToKilogramConversion(packageItem.weight!);
      packageItem.weight = weight
    }

    if(Constants.CM_VOLUME_UNIT_ID.toLowerCase()== packageItem.volumeUnitId){
      chargeableWeight = ((packageItem.width! * packageItem.length! * packageItem.height!)/1000000)*167;
      chargeableWeightTotal = packageItem.weight!>chargeableWeight? packageItem.weight!* packageItem.pieces! : chargeableWeight * packageItem.pieces!;
    }else if(Constants.INCH_VOLUME_UNIT_ID.toLowerCase()== packageItem.volumeUnitId){
      chargeableWeight = ((packageItem.width! * packageItem.length! * packageItem.height!)/61023.7)*167;
      chargeableWeightTotal = packageItem.weight!>chargeableWeight? packageItem.weight!* packageItem.pieces! : chargeableWeight * packageItem.pieces!;
    }else if(Constants.METER_VOLUME_UNIT_ID.toLowerCase()== packageItem.volumeUnitId){
      chargeableWeight = (packageItem.width! * packageItem.length! * packageItem.height!)*167;
      chargeableWeightTotal = packageItem.weight!>chargeableWeight? packageItem.weight!* packageItem.pieces! : chargeableWeight * packageItem.pieces!;
    }
    return CoreExtensions.RoundToTwoDecimalPlaces(Number(chargeableWeightTotal))
  }

  getCargoType(type: number) {
    return CoreExtensions.GetCargoType(type);
  }

  getContainerName(packageContainer: any) {
    return CoreExtensions.GetContainerName(packageContainer.packageContainerType);
  }

  delete(packageItem: PackageItem) {
    const index = this.cargoBookingRequest?.packageItems?.indexOf(packageItem);
    if (index !== -1) {
      this.cargoBookingRequest?.packageItems?.splice(Number(index), 1);
    }
    if(this.cargoBookingRequest.packageItems != null && this.cargoBookingRequest.packageItems.length <= 0){
      this.cargoBookingRequest.aWBDetail = undefined;
      this.awbDetail = undefined;
    }
  }

  submit() {
    if (this.isValid()) {
      this.cargoBookingRequest.bookingStatus = BookingStatus.Pending;
      this.cargoBookingRequest.aWBStatus = AWBStatus.Pending;
      this.uldCargoBookingService.create(this.cargoBookingRequest).subscribe(res => {
        this.toastr.success('Saved Successfully.');
        this.flightScheduleSectorService.removeCurrentFlightScheduleSector();
        this.router.navigate(['booking']);
      })
    }
  }

  isValid(): boolean {
    let valid = true;
    if (this.cargoBookingRequest == undefined || this.cargoBookingRequest?.packageItems == undefined) {
      valid = false;
      this.toastr.warning('Data is not valid.');
    } else if (this.cargoBookingRequest != undefined && this.cargoBookingRequest?.packageItems != undefined && this.cargoBookingRequest?.packageItems?.length < 1) {
      valid = false;
      this.toastr.warning('Package item details are required.');
    }
    return valid;
  }



  backToSearch() {
    this.router.navigate(['booking/search', this.flightScheduleSectorId]);
  }

  submitAWBDetail(awb: AWBCreateRM) {
    awb.userId = this.currentUser?.id != null ? this.currentUser?.id : "";
    this.awbDetail = awb;
    if (this.awbDetail != null) {
      this.cargoBookingRequest.aWBDetail = awb;
    }
  }

  openAWBForm() {
    if(this.cargoBookingRequest.packageItems != null && this.cargoBookingRequest.packageItems.length >0){
      if(this.cargoBookingRequest.aWBDetail==null){
        this.awbDetail = new AWBCreateRM();
        this.awbDetail.agentAccountNumber = this.cargoAgent?.cargoAccountNumber;
        this.awbDetail.agentAITACode = this.cargoAgent?.agentIATACode;
        this.awbDetail.agentCity = this.cargoAgent?.city;
        this.awbDetail.agentName = this.cargoAgent?.agentName;
        this.awbDetail.routingAndDestinationTo = this.flightScheduleSector?.destinationAirportCode;
        this.awbDetail.routingAndDestinationBy = this.flightScheduleSector?.flightNumber.substring(0, 2);
        this.awbDetail.requestedFlightDate = this.flightScheduleSector?.scheduledDepartureDateTime;
        this.awbDetail.destinationAirportName = this.flightScheduleSector?.destinationAirportName;
        this.awbDetail.destinationAirportId = this.flightScheduleSector?.destinationAirportId;
      }else{
        this.awbDetail = this.cargoBookingRequest.aWBDetail;
        this.awbDetail.isEditAWB = true;
      }
      
      this.modalVisible = true;
      setTimeout(() => (this.modalVisibleAnimate = true));

    }
  }


  closeAWBForm() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
      this.getCargoAgentDetails(this.currentUser!.id);
    });
  }

  getPackageStatus(status: number): string {
    return CoreExtensions.GetPackageStatus(status)
  }

  get packageItemStatus(): typeof PackageItemStatus {
    return PackageItemStatus;
  }
}
