import { PackageItem } from './../../../_models/view-models/package-item.model';
import { ToastrService } from 'ngx-toastr';
import { PackageContainerService } from './../../../_services/package-container.service';
import { FlightScheduleSectorService } from 'src/app/_services/flight-schedule-sector.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightScheduleSectorQuery } from '../../../_models/queries/flight-schedule-sector/flight-schedule-sector-query.model';
import { FlightScheduleSector } from 'src/app/_models/view-models/flight-schedule-sector.model';
import { PackageContainer } from 'src/app/_models/view-models/package-container/package-container.model';
import { PackageContainerListQuery } from 'src/app/_models/queries/package-container/package-container-list-query.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { BookingService } from 'src/app/_services/booking.service';
import { CargoBookingRequest } from 'src/app/_models/view-models/cargo-booking/cargo-booking-request.model';
import { BookingStatus, PackageContainerType, PackageItemCategory, PackageItemStatus, PackagePriorityType } from 'src/app/core/enums/common-enums';


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

  constructor(private activatedRoute: ActivatedRoute,
    private flightScheduleSectorService: FlightScheduleSectorService,
    private packageContainerService: PackageContainerService,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    this.getId();
  }

  ngOnInit(): void {
    this.createForm();
    this.bookingForm?.get('packageItems')?.get("packageItemCategory")?.valueChanges.subscribe(x => {
      var query = new PackageContainerListQuery();
      query.packageItemType = x;
      this.getPackageContainers(query);
   });

    this.bookingForm?.get('packageItems')?.get("packageDimention")?.valueChanges.subscribe(res => { debugger
    console.log(this.bookingForm.value);
      if(res != 1) {
        var value = this.packageContainers?.filter(x=> x.id== res)[0];
        if(value)
          this.patchPackageDimentions(value);
      }
   });

   this.cargoBookingRequest = new CargoBookingRequest();
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
        width: [0],
        length: [0],
        weight: [0],
        height: [0],
        packageItemCategory: [],
        weightUnitId: [null,[Validators.required]],
        volumeUnitId: [null,[Validators.required]],
        packageDimention:['',[Validators.required]],
        packageItemStatus:[PackageItemStatus.Pending],
        description:['']
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

  add() { debugger
    if(this.bookingForm.valid) {
      var booking = this.bookingForm.value;
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

    }
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
      packageContainerType: this.getPackageContainerType(packageItem.packageDimention)
    };
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

  editPackage(packageItem: PackageItem){

  }

  submit() {
    if(this.isValid()) {
        this.bookingService.create(this.cargoBookingRequest).subscribe(res => {
        this.toastr.success('Saved Successfully.');
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

}
