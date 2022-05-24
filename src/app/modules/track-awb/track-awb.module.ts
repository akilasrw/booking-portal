import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackAwbRoutingModule } from './track-awb-routing.module';
import { AwbSearchComponent } from './awb-search/awb-search.component';


@NgModule({
  declarations: [
    AwbSearchComponent
  ],
  imports: [
    CommonModule,
    TrackAwbRoutingModule
  ]
})
export class TrackAwbModule { }
