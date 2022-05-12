import { AirportService } from './../../../_services/airport.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CargoRateListService } from 'src/app/_services/cargo-rate-list.service';
import { CargoRate } from 'src/app/_models/view-models/cargo-rate-list/cargo-rate.model';
import { CargoRateFilterQuery } from 'src/app/_models/queries/cargo-rate/cargo-rate-filter-query.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';


@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent implements OnInit {

  public searchForm!:FormGroup;

  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  cargoRateList: CargoRate[] = []
  keyword = 'value';


  
  constructor(private fb:FormBuilder,
    private airportService:AirportService,
    private cargoRateListService:CargoRateListService) { }

  ngOnInit(): void {
    this.initializeForm();
    this. loadAirports();
  }

  initializeForm(){
    this.searchForm = this.fb.group({
      originAirportId: [null, [Validators.required]],
      destinationAirportId: [null, [Validators.required]]
    });
  }

  loadAirports(){
    this.airportService.getSelectList()
      .subscribe(res => {
        if(res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
      });
  }

  getRateList(){
    if(this.searchForm.valid){
      var qury: CargoRateFilterQuery = this.searchForm.value;
      this.cargoRateListService.getFilteredRateList(qury).subscribe(
        {
          next: (res) => {
            this.cargoRateList = res.data
          },
          error: (error) => this.cargoRateList=[]
        }
      )    
    }
  }

  selectedOrigin(value: any){
    this.searchForm.get('originAirportId')?.patchValue(value.id);
  }

  selectedDestination(value: any){
    this.searchForm.get('destinationAirportId')?.patchValue(value.id);
  }

  GetPackageDimentions(item :CargoRate):string{
   return CoreExtensions.GetPackageDimentions(item.length,item.width,item.height )
  }

  GetPackageContainerType(value:number):string{
    return CoreExtensions.GetPackageContainerType(value)

  }

  GetPackageBoxType(value:number):string{
    return CoreExtensions.GetPackageBoxType(value)
  }

}
