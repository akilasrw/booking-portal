import { AirportService } from './../../../_services/airport.service';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CargoRateListService } from 'src/app/_services/cargo-rate-list.service';
import { AgentRateFilterQuery } from 'src/app/_models/queries/cargo-rate/agent-rate-filter-query.model';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { AgentRateManagement } from 'src/app/_models/view-models/cargo-rate-list/agent-rate-management.model';

@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent implements OnInit {

  cargoRateFilterQuery: AgentRateFilterQuery = new AgentRateFilterQuery();
  originAirportId?: string;
  destinationAirportId?: string;
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  currentUser?: User | null;
  subscription?: Subscription;
  agentRateList: AgentRateManagement[] = []
  keyword = 'value';
  totalCount: number = 0;
  isLoading :boolean= false;

  constructor(
    private airportService: AirportService,
    private accountService: AccountService,
    private cargoRateListService: CargoRateListService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.loadAirports();
    this.getRateList(); 
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  loadAirports() {
    this.isLoading=true;
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
        this.isLoading=false;
      });
  }

  getRateList() {
      this.isLoading=true;
      this.cargoRateFilterQuery.userId = this.currentUser?.id;
      this.cargoRateFilterQuery.originAirportId = this.originAirportId;
      this.cargoRateFilterQuery.destinationAirportId = this.destinationAirportId;
      this.cargoRateListService.getFilteredRateList(this.cargoRateFilterQuery).subscribe(
        {
          next: (res) => {
            this.agentRateList = res.data;
            this.totalCount = res.count;
            this.isLoading=false;
          },
          error: (error) => {
            this.totalCount = 0;
            this.agentRateList = [];
            this.isLoading=false;
          }
        }
      )
  }

  onClearOrigin() {
    this.originAirportId = undefined;
  }

  onClearDestination() {
    this.destinationAirportId = undefined;
  }

  selectedOrigin(value: any) {
    this.originAirportId = value.id;
  }

  selectedDestination(value: any) {
    this.destinationAirportId = value.id;
  }

  public onPageChanged(event: any) {
    if (this.cargoRateFilterQuery?.pageIndex !== event) {
      this.cargoRateFilterQuery.pageIndex = event;
      this.getRateList();
    }
  }

}
