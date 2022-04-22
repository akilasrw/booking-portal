import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CargoRateRoutingModule } from './cargo-rate-routing.module';
import { RateListComponent } from './rate-list/rate-list.component';


@NgModule({
  declarations: [
    RateListComponent
  ],
  imports: [
    CommonModule,
    CargoRateRoutingModule,
    SharedModule,
  ]
})
export class CargoRateModule { }
