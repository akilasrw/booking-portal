import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BookingSearchComponent } from './booking-search/booking-search.component';
import { BookingViewDetailComponent } from './booking-view-detail/booking-view-detail.component';
import { AwbCreateComponent } from './awb-create/awb-create.component';
import { P2cBookingSearchItemComponent } from './booking-search-item/p2c-booking-search-item/p2c-booking-search-item.component';
import { FreighterBookingSearchItemComponent } from './booking-search-item/freighter-booking-search-item/freighter-booking-search-item.component';
import { P2cBookingCreateComponent } from './booking-create/p2c-booking-create/p2c-booking-create.component';
import { FreighterBookingCreateComponent } from './booking-create/freighter-booking-create/freighter-booking-create.component';
import {BookingLookupModule} from "../booking-lookup/booking-lookup.module";
import { BookingInfoComponent } from './booking-info/booking-info.component';

@NgModule({
  declarations: [
    BookingListComponent,
    BookingInfoComponent,
    BookingSearchComponent,
    BookingViewDetailComponent,
    AwbCreateComponent,
    P2cBookingSearchItemComponent,
    FreighterBookingSearchItemComponent,
    P2cBookingCreateComponent,
    FreighterBookingCreateComponent
  ],
    imports: [
        CommonModule,
        BookingRoutingModule,
        SharedModule,
        BsDatepickerModule,
        BookingLookupModule
    ]
})
export class BookingModule { }
