import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingLookupRoutingModule } from './booking-lookup-routing.module';
import { BookingLookupSearchComponent } from './booking-lookup-search/booking-lookup-search.component';
import { BookingLookupPrintComponent } from './booking-lookup-print/booking-lookup-print.component';


@NgModule({
  declarations: [
    BookingLookupSearchComponent,
    BookingLookupPrintComponent
  ],
  imports: [
    CommonModule,
    BookingLookupRoutingModule,
    SharedModule,
  ]
})
export class BookingLookupModule { }
