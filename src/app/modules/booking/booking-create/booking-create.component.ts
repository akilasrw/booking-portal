import { Validate } from './../../../shared/models/validate.model';
import { ValidateCargoPositionRequest } from './../../../_models/request-models/cargo-booking/validate-cargo-position-request.model';
import { CargoPositionService } from './../../../_services/cargo-position.service';
import { Unit } from './../../../_models/view-models/unit/unit.model';
import { PackageItem } from './../../../_models/view-models/package-item.model';
import { ToastrService } from 'ngx-toastr';
import { PackageContainerService } from './../../../_services/package-container.service';
import { FlightScheduleSectorService } from 'src/app/_services/flight-schedule-sector.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightScheduleSectorQuery } from '../../../_models/queries/flight-schedule-sector/flight-schedule-sector-query.model';
import { PackageContainer } from 'src/app/_models/view-models/package-container/package-container.model';
import { PackageContainerListQuery } from 'src/app/_models/queries/package-container/package-container-list-query.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { BookingService } from 'src/app/_services/booking.service';
import { CargoBookingRequest } from 'src/app/_models/view-models/cargo-booking/cargo-booking-request.model';
import { BookingStatus, PackageContainerType, PackageItemStatus, PackagePriorityType, UnitType } from 'src/app/core/enums/common-enums';
import { UnitService } from 'src/app/_services/unit.service';
import { FlightScheduleSector } from 'src/app/_models/view-models/flight-schedule-sectors/flight-schedule-sector.model';


@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.scss']
})
export class BookingCreateComponent implements OnInit {
  modalVisible = false;
  modalVisibleAnimate = false;
  flightScheduleSectorId!: string;
  flightScheduleSector?: FlightScheduleSector;
  packageContainers?: PackageContainer[]=[];
  bookingForm!: FormGroup;
  cargoBookingRequest!: CargoBookingRequest;
  volumeUnits: Unit[] = [];
  weightUnits: Unit[] = [];
  disableInput: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private flightScheduleSectorService: FlightScheduleSectorService,
    private packageContainerService: PackageContainerService,
    private bookingService: BookingService,
    private cargoPositionService: CargoPositionService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private unitService: UnitService,
    private router: Router) {
    this.getId();
    this.cargoBookingRequest = new CargoBookingRequest();
  }

  ngOnInit(): void {
    this.createForm();
    this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.valueChanges.subscribe(x => {
      var query = new PackageContainerListQuery();
      query.packageItemType = x;
      this.getPackageContainers(query);
   });

    this.bookingForm?.get('packageItems')?.get("packageDimention")?.valueChanges.subscribe(res => {
    console.log(this.bookingForm.value);
      if(res != 1) {
        var value = this.packageContainers?.filter(x=> x.id== res)[0];
        if(value)
          this.patchPackageDimentions(value);
          this.disableInput = true;
      } else {
        this.disableInput = false;
      }
   });
   this.getUnits();
  }

  getUnits(){
    this.unitService.getList()
    .subscribe(res =>{
      console.log("units: ", res);
      this.weightUnits = res.filter(x=> x.unitType == UnitType.Mass);
      this.volumeUnits = res.filter(x=> x.unitType == UnitType.Length);
    });
  }

  patchPackageDimentions(container: PackageContainer) {
    this.bookingForm.get('packageItems')?.get('width')?.patchValue(container.width);
    this.bookingForm.get('packageItems')?.get('height')?.patchValue(container.height);
    this.bookingForm.get('packageItems')?.get('length')?.patchValue(container.length);
  }

  createForm() {
    this.bookingForm = this.fb.group({
      flightScheduleSectorId:[''],
      packageItems: this.fb.group({
        id: [''],
        width: [0,[Validators.required, Validators.min(1)]],
        length: [0,[Validators.required, Validators.min(1)]],
        weight: [0,[Validators.required, Validators.min(1)]],
        height: [0,[Validators.required, Validators.min(1)]],
        packageItemCategory: [],
        weightUnitId: ['bc1e3d49-5c26-4de5-9cd4-576bbf6e9d0c',[Validators.required]],
        volumeUnitId: ['11c39205-4153-49f1-ab50-bba8913c5bb9',[Validators.required]],
        packageDimention:['',[Validators.required]],
        packageItemStatus:[PackageItemStatus.Pending],
        description:[''],
        isEdit: [false]
      }),
    })
  }

  getId() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.flightScheduleSectorId = id;
        console.log(id);
        this.getFlightScheduleSectorData();
      }
    });
  }

  getFlightScheduleSectorData() {
    var query:  FlightScheduleSectorQuery = {
      id: this.flightScheduleSectorId
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

  async add() {
    if(this.bookingForm.valid) {
      var booking = this.bookingForm.value;
      if(this.isAvailableSpace(booking.packageItems.packageDimention)){
        if(await this.isWeightNotExceed(booking.packageItems) == true){
          if(this.cargoBookingRequest.packageItems == undefined) {
            this.cargoBookingRequest = {
              flightScheduleSectorId: this.flightScheduleSectorId,
              packageItems:[this.mapPackageItems(booking.packageItems)]
            };
          } else if (this.cargoBookingRequest.packageItems?.findIndex(x=>x.height == booking.height && x.length == booking.length && x.width == booking.width) == -1) {
            this.cargoBookingRequest.packageItems?.push(this.mapPackageItems(booking.packageItems));
          } else {
            this.toastr.warning('Package is already exists.');
          }
          console.log(this.cargoBookingRequest);
          this.resetForm();
        }
      }
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  editPackage(packageItem: PackageItem) {
    this.bookingForm.get('packageItems')?.get('width')?.patchValue(packageItem.width);
    this.bookingForm.get('packageItems')?.get('length')?.patchValue(packageItem.length);
    this.bookingForm.get('packageItems')?.get('weight')?.patchValue(packageItem.weight);
    this.bookingForm.get('packageItems')?.get('height')?.patchValue(packageItem.height);
    this.bookingForm.get('packageItems')?.get('weightUnitId')?.patchValue(packageItem.weightUnitId);
    this.bookingForm.get('packageItems')?.get('volumeUnitId')?.patchValue(packageItem.volumeUnitId);
    this.bookingForm.get('packageItems')?.get('isEdit')?.patchValue(true);
    console.log(this.bookingForm.value);
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
  }

  mapPackageItems(packageItem: any) {
    return {
      height: Number(packageItem.height),
      length: Number(packageItem.length),
      weight: Number(packageItem.weight),
      width: Number(packageItem.width),
      packagePriorityType: PackagePriorityType.None,
      packageItemCategory: Number(packageItem.packageItemCategory),
      weightUnitId: packageItem.weightUnitId,
      volumeUnitId: packageItem.volumeUnitId,
      packageItemStatus: Number(packageItem.packageItemStatus),
      description: packageItem.description,
      packageContainerType: this.getPackageContainerType(packageItem.packageDimention),
      isEdit: packageItem.isEdit
    };
  }

  isAvailableSpace(packageDimension: any) : boolean {
    debugger
    let containerType = this.getPackageContainerType(packageDimension);
    console.log(this.flightScheduleSector);
    var availableSpaceCount =0;
    var result = this.flightScheduleSector?.flightScheduleSectorCargoPositions.filter(x=> x.cargoPositionType == Number(containerType) && x.availableSpaceCount > 0);
    if(result !== undefined && result.length > 0){
      availableSpaceCount = result[0].availableSpaceCount
    }
    if(availableSpaceCount == 0) {
      this.toastr.warning('Space is not available.');
      return false;
    } else if(this.cargoBookingRequest.packageItems &&
      availableSpaceCount <= this.cargoBookingRequest.packageItems?.filter(x=> x.packageContainerType == containerType).length) {
      this.toastr.warning('Maximum limit is exceed.');
      return false;
    }
    return true;
  }

  async isWeightNotExceed(cargoPackage : PackageItem){
    var request : ValidateCargoPositionRequest = {
      packageItem : this.mapPackageItems(cargoPackage),
      flightScheduleSectorId: this.flightScheduleSectorId
    };
    var response = await this.cargoPositionService.validateWeight(request).toPromise();
    if(response !== undefined){
      if(!response.isValid){
        this.toastr.error(response.validationMessage);
      }
      return response.isValid;
    }else{
      return false;
    }
  }

  getPackageContainerType(id: string) {
    var result = this.packageContainers?.filter(x=> x.id == id);
    if(result != undefined && result?.length > 0 )
      return result[0].packageContainerType;
    return PackageContainerType.None;
  }

  getPackageDimentions(packageContainer: any) {
    return CoreExtensions.GetPackageDimentions(packageContainer.length, packageContainer.width, packageContainer.height);
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
    if(this.isValid()) {
        this.cargoBookingRequest.bookingStatus = BookingStatus.Pending;
        this.bookingService.create(this.cargoBookingRequest).subscribe(res => {
        this.toastr.success('Saved Successfully.');
        this.flightScheduleSectorService.removeCurrentFlightScheduleSector();
        this.router.navigate(['booking']);
      })
    }
  }

  isValid(): boolean {
    let valid = true;
    if(this.cargoBookingRequest == undefined || this.cargoBookingRequest?.packageItems == undefined){
      valid = false;
      this.toastr.warning('Data is not valid.');
    } else if(this.cargoBookingRequest != undefined && this.cargoBookingRequest?.packageItems != undefined && this.cargoBookingRequest?.packageItems?.length < 1) {
      valid = false;
      this.toastr.warning('Package item details are required.');
    }
    return valid;
  }

  show() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  hide() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  cancel() {
    this.hide();
  }

  closePopup(isSuccess: Boolean) {
    if (isSuccess) {
    }
    this.hide();
  }

  backToSeach() {
    this.router.navigate(['booking/search', this.flightScheduleSectorId]);
  }

}
