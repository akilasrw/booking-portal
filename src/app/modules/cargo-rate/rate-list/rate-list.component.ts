import { AirportService } from './../../../_services/airport.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CargoRateListService } from 'src/app/_services/cargo-rate-list.service';
import { CargoRate } from 'src/app/_models/view-models/cargo-rate-list/cargo-rate.model';
import { CargoRateFilterQuery } from 'src/app/_models/queries/cargo-rate/cargo-rate-filter-query.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent implements OnInit {

  searchForm!: FormGroup;
  cargoRateFilterQuery: CargoRateFilterQuery = new CargoRateFilterQuery();
  originAirportId?: string;
  destinationAirportId?: string;
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  cargoRateList: CargoRate[] = []
  keyword = 'value';
  totalCount: number = 0;

  constructor(private fb: FormBuilder,
    private airportService: AirportService,
    private toastr: ToastrService,
    private cargoRateListService: CargoRateListService) { }

  ngOnInit(): void {
    this.loadAirports();
  }

  loadAirports() {
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
      });
  }

  getRateList() {
    if (this.isformValid()) {
      this.cargoRateFilterQuery.originAirportId = this.originAirportId;
      this.cargoRateFilterQuery.destinationAirportId = this.destinationAirportId;
      this.cargoRateListService.getFilteredRateList(this.cargoRateFilterQuery).subscribe(
        {
          next: (res) => {
            this.cargoRateList = res.data
            this.totalCount = res.count
          },
          error: (error) => {
            this.totalCount = 0;
            this.cargoRateList = []
          }
        }
      )
    }
  }

  isformValid(): boolean {
    debugger
    if ((this.originAirportId === undefined || this.originAirportId === "") ||
      (this.destinationAirportId === undefined || this.destinationAirportId === "")) {
      this.toastr.error('Please select origin and destination.');
      return false;
    } else {
      if (this.originAirportId === this.destinationAirportId) {
        this.toastr.error('Origin and destination is same.');
        return false;
      } else {
        return true;
      }
    }
  }

  selectedOrigin(value: any) {
    this.originAirportId = value.id;
  }

  selectedDestination(value: any) {
    this.destinationAirportId = value.id;
  }

  GetPackageDimentions(item: CargoRate): string {
    return CoreExtensions.GetPackageDimentions(item.length, item.width, item.height)
  }

  GetPackageContainerType(value: number): string {
    return CoreExtensions.GetPackageContainerType(value)

  }

  GetPackageBoxType(value: number): string {
    return CoreExtensions.GetPackageBoxType(value)
  }

}
