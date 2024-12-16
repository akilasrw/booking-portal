import { FlightSchedule } from './../../../../_models/view-models/flight-schedule/flight-schedule.model';
import { ToastrService } from 'ngx-toastr';
import { FlightScheduleService } from 'src/app/_services/flight-schedule.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PackageContainer } from 'src/app/_models/view-models/package-container/package-container.model';
import { PackageContainerListQuery } from 'src/app/_models/queries/package-container/package-container-list-query.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { BookingService } from 'src/app/_services/booking.service';
import { CargoBookingRequest } from 'src/app/_models/view-models/cargo-booking/cargo-booking-request.model';
import { AWBStatus, BookingStatus, PackageContainerType, PackageItemStatus, PackagePriorityType, UnitType } from 'src/app/core/enums/common-enums';
import { UnitService } from 'src/app/_services/unit.service';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { Constants } from 'src/app/core/constants/constants';
import { FlightScheduleSectorQuery } from 'src/app/_models/queries/flight-schedule-sector/flight-schedule-sector-query.model';
import { PackageContainerService } from 'src/app/_services/package-container.service';
import { CargoPositionService } from 'src/app/_services/cargo-position.service';
import { PackageItem } from 'src/app/_models/view-models/package-item.model';
import { Unit } from 'src/app/_models/view-models/unit/unit.model';
import { ValidateCargoPositionRequest } from 'src/app/_models/request-models/cargo-booking/validate-cargo-position-request.model';
import { AWBCreateRM } from 'src/app/_models/request-models/awb/awb-create-rm.model';
import { CargoAgent } from 'src/app/_models/view-models/cargo-agent/cargo-agent.model';
import { CargoAgentQuery } from 'src/app/_models/queries/cargo-agent/cargo-agent-query.model';

@Component({
  selector: 'app-p2c-booking-create',
  templateUrl: './p2c-booking-create.component.html',
  styleUrls: ['./p2c-booking-create.component.scss']
})
export class P2cBookingCreateComponent implements OnInit {
  modalVisible = false;
  modalVisibleAnimate = false;
  packageContainers?: PackageContainer[] = [];
  bookingForm!: FormGroup;
  cargoBookingRequest!: CargoBookingRequest;
  volumeUnits: Unit[] = [];
  weightUnits: Unit[] = [];
  disableInput: boolean = true;
  currentUser?: User | null
  subscription?: Subscription;
  awbDetail?: AWBCreateRM;
  cargoAgent?: CargoAgent;
  flightSchedule?: FlightSchedule;

  constructor(
    private flightScheduleService: FlightScheduleService,
    private packageContainerService: PackageContainerService,
    private bookingService: BookingService,
    private accountService: AccountService,
    private cargoPositionService: CargoPositionService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private unitService: UnitService,
    private router: Router) {
    let nav = this.router.getCurrentNavigation();
    if (nav?.extras && nav.extras.state && nav.extras.state['flightScheduleData']) {
      this.flightSchedule = nav.extras.state['flightScheduleData'] as FlightSchedule;
    }
    this.cargoBookingRequest = new CargoBookingRequest();
  }

  ngOnInit(): void {
    this.createForm();
    this.getCurrentUser();
    this.getUnits();
    this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.valueChanges.subscribe(x => {
      var query = new PackageContainerListQuery();
      query.packageItemType = x;
      this.getPackageContainers(query);
    });

    this.bookingForm?.get('packageItems')?.get("packageDimention")?.valueChanges.subscribe(res => {
      console.log(this.bookingForm.value);
      this.awbDetail= undefined;
      if (res != 1) {
        var value = this.packageContainers?.filter(x => x.id == res)[0];
        if (value)
          this.patchPackageDimentions(value);
        this.disableInput = true;
      } else {
        this.disableInput = false;
      }
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
      packageItems: this.fb.group({
        id: [''],
        width: [0, [Validators.required, Validators.min(1)]],
        length: [0, [Validators.required, Validators.min(1)]],
        weight: [0, [Validators.required, Validators.min(1)]],
        height: [0, [Validators.required, Validators.min(1)]],
        packageItemCategory: [],
        weightUnitId: ['bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c', [Validators.required]],
        volumeUnitId: ['9f0928df-5d33-4e5d-affc-f7e2e2b72680', [Validators.required]],
        packageDimention: ['', [Validators.required]],
        packageItemStatus: [PackageItemStatus.Pending],
        description: [''],
        isEdit: [false],
      }),
    })
  }

  getPackageContainers(query: PackageContainerListQuery) {
    this.packageContainerService.getList(query).subscribe(res => {
      this.packageContainers = res;
    });
  }

  getCargoAgentDetails(userId: string) {
    var query = new CargoAgentQuery();
    query.appUserId = userId;
    query.isCountryInclude = true;
    this.accountService.getUserDetail(query).subscribe(res => {
      this.cargoAgent = res;
    });
  }

  async add() {
    if (this.isBookingFormValied() && this.bookingForm.valid) {
      var booking = this.bookingForm.value;
      if (await this.isAvailableSpace(booking.packageItems.packageDimention) == true) {
        if (await this.isWeightNotExceed(booking.packageItems) == true) {
          if (this.cargoBookingRequest.packageItems == undefined) {
            this.cargoBookingRequest = {
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

  isBookingFormValied(): boolean {

    if ((this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.value === null ||
      this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.value === "") &&
      (this.bookingForm?.get('packageItems')?.get("packageDimention")?.value === null ||
        this.bookingForm?.get('packageItems')?.get("packageDimention")?.value === "")) {
      this.toastr.error('Please select cargo type and package dimentions.');
      return false;
    }

    if (this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.value === null ||
      this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.value === "") {
      this.toastr.error('Please select cargo type.');
      return false;
    }

    if (this.bookingForm?.get('packageItems')?.get("packageDimention")?.value === null ||
      this.bookingForm?.get('packageItems')?.get("packageDimention")?.value === "") {
      this.toastr.error('Please select package dimentions.');
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
  }

  resetForm() {
    this.bookingForm.get('packageItems')?.get('width')?.patchValue(0);
    this.bookingForm.get('packageItems')?.get('length')?.patchValue(0);
    this.bookingForm.get('packageItems')?.get('weight')?.patchValue(0);
    this.bookingForm.get('packageItems')?.get('height')?.patchValue(0);
    this.bookingForm.get('packageItems')?.get('packageDimention')?.patchValue('');
    this.bookingForm.get('packageItems')?.get('packageItemStatus')?.patchValue(PackageItemStatus.Pending);
    this.bookingForm.get('packageItems')?.get('description')?.patchValue('');
    this.bookingForm.get('packageItems')?.get('isEdit')?.patchValue(false);
    this.bookingForm.get('packageItems')?.get('weightUnitId')?.patchValue('bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c');
    this.bookingForm.get('packageItems')?.get('volumeUnitId')?.patchValue('9f0928df-5d33-4e5d-affc-f7e2e2b72680');
    this.awbDetail = undefined;
  }

  convertToMeters(value: number, fromUnitId: string): number {
    switch(fromUnitId.toLowerCase()) {
      case Constants.CM_VOLUME_UNIT_ID.toLowerCase(): // cm
        return Number((value / 100).toFixed(2));
      case Constants.INCH_VOLUME_UNIT_ID.toLowerCase(): // inch  
        return Number((value * 0.0254).toFixed(2));
      case Constants.METER_VOLUME_UNIT_ID.toLowerCase(): // m
        return Number(value.toFixed(2));
      default:
        return Number(value.toFixed(2));
    }
  }

  mapPackageItems(packageItem: any) {
    const width = this.convertToMeters(Number(packageItem.width), packageItem.volumeUnitId);
    const length = this.convertToMeters(Number(packageItem.length), packageItem.volumeUnitId);
    const height = this.convertToMeters(Number(packageItem.height), packageItem.volumeUnitId);

    return {
      height: height,
      length: length,
      weight: CoreExtensions.RoundToTwoDecimalPlaces(Number(packageItem.weight)),
      width: width,
      packagePriorityType: PackagePriorityType.None,
      packageItemCategory: Number(packageItem.packageItemCategory),
      weightUnitId: packageItem.weightUnitId,
      volumeUnitId: packageItem.volumeUnitId,
      packageItemStatus: Number(PackageItemStatus.Pending),
      description: packageItem.description,
      packageContainerType: this.getPackageContainerType(packageItem.packageDimention),
      isEdit: packageItem.isEdit,
      aWBDetail: this.awbDetail,
    };
  }

  async isAvailableSpace(packageDimension: any) {
    var availableSpaceCount = 0;

    let containerType = this.getPackageContainerType(packageDimension);

    if (containerType == PackageContainerType.OnThreeSeats) {
      var query: FlightScheduleSectorQuery = {
        id: this.flightSchedule?.flightScheduleSectorIds[0],
        includeLoadPlan: true
      };
      var response = await this.cargoPositionService.getAvailableThreeSeats(query).toPromise();
      if (response !== undefined) {
        availableSpaceCount = response.SeatCount;
      }
    } else {
      var sectorCargoPositions = this.flightSchedule?.flightScheduleSectorCargoPositions.filter(x => x.cargoPositionType == Number(containerType) && x.availableSpaceCount > 0);
      if (sectorCargoPositions !== undefined && sectorCargoPositions.length > 0) {
        availableSpaceCount = sectorCargoPositions[0].availableSpaceCount
      }
    }

    if (availableSpaceCount == 0) {
      this.toastr.warning('Space is not available.');
      return false;
    } else if (this.cargoBookingRequest.packageItems &&
      availableSpaceCount <= this.cargoBookingRequest.packageItems?.filter(x => x.packageContainerType == containerType).length) {
      this.toastr.warning('Maximum limit is exceed.');
      return false;
    }

    return true;
  }

  async isWeightNotExceed(cargoPackage: PackageItem) {
    var request: ValidateCargoPositionRequest = {
      packageItem: this.mapPackageItems(cargoPackage),
      flightScheduleSectorIds: this.flightSchedule?.flightScheduleSectorIds
    };
    var response = await this.cargoPositionService.validateWeight(request).toPromise();
    if (response !== undefined) {
      if (!response.isValid) {
        this.toastr.error(response.validationMessage);
      }
      return response.isValid;
    } else {
      return false;
    }
  }

  getPackageContainerType(id: string) {
    var result = this.packageContainers?.filter(x => x.id == id);
    if (result != undefined && result?.length > 0)
      return result[0].packageContainerType;
    return PackageContainerType.None;
  }

  getPackageDimentions(packageContainer: any) {
    return CoreExtensions.GetPackageDimentions(packageContainer.length, packageContainer.width, packageContainer.height);
  }

  getPackageWeight(weight: number, weightUnitId: string) {
    if (Constants.BASE_WEIGHT_UNIT_ID.toLowerCase() == weightUnitId) {
      return weight;
    } else {
      return CoreExtensions.GramToKilogramConversion(weight)
    }
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
  }

  submit() {
    if (this.isValid()) {
      this.cargoBookingRequest.flightScheduleSectorIds = this.flightSchedule?.flightScheduleSectorIds;
      this.cargoBookingRequest.bookingStatus = BookingStatus.Booking_Made;
      this.cargoBookingRequest.aWBStatus = AWBStatus.Pending;
      this.cargoBookingRequest.originAirportId = this.flightSchedule?.originAirportId;
      this.cargoBookingRequest.destinationAirportId = this.flightSchedule?.destinationAirportId;
      this.bookingService.create(this.cargoBookingRequest).subscribe(res => {
        this.toastr.success('Saved Successfully.');
        this.flightScheduleService.removeCurrentFlightSchedule();
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
    this.router.navigate(['booking/search', this.flightSchedule?.id]);
  }

  submitAWBDetail(awb: AWBCreateRM) {
    awb.userId = this.currentUser?.id != null ? this.currentUser?.id : "";
    this.awbDetail = awb;
    if (this.awbDetail != null) {
      this.cargoBookingRequest.aWBDetail = awb;
    }
  }

  openAWBForm() {
    if (this.cargoBookingRequest.packageItems != null && this.cargoBookingRequest.packageItems.length > 0) {

      if (this.cargoBookingRequest.aWBDetail == null) {
        this.awbDetail = new AWBCreateRM();
        this.awbDetail.agentAccountNumber = this.cargoAgent?.cargoAccountNumber;
        this.awbDetail.agentAITACode = this.cargoAgent?.agentIATACode;
        this.awbDetail.agentCity = this.cargoAgent?.city;
        this.awbDetail.agentName = this.cargoAgent?.agentName;
        this.awbDetail.routingAndDestinationTo = this.flightSchedule?.destinationAirportCode;
        this.awbDetail.routingAndDestinationBy = this.flightSchedule?.flightNumber.substring(0, 2);
        this.awbDetail.requestedFlightDate = this.flightSchedule?.scheduledDepartureDateTime;
        this.awbDetail.destinationAirportName = this.flightSchedule?.destinationAirportName;
        this.awbDetail.destinationAirportId = this.flightSchedule?.destinationAirportId;
      } else {
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
