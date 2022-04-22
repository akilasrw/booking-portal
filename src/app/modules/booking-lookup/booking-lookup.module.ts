import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingLookupRoutingModule } from './booking-lookup-routing.module';
import { BookingLookupSearchComponent } from './booking-lookup-search/booking-lookup-search.component';


@NgModule({
  declarations: [
    BookingLookupSearchComponent
  ],
  imports: [
    CommonModule,
    BookingLookupRoutingModule,
    SharedModule,
  ]
})
export class BookingLookupModule { }
