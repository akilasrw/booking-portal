import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingCreateComponent } from './booking-create/booking-create.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BookingSearchComponent } from './booking-search/booking-search.component';
import { BookingViewDetailComponent } from './booking-view-detail/booking-view-detail.component';
import { AwbCreateComponent } from './awb-create/awb-create.component';

@NgModule({
  declarations: [
    BookingCreateComponent,
    BookingListComponent,
    BookingSearchComponent,
    BookingViewDetailComponent,
    AwbCreateComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class BookingModule { }
