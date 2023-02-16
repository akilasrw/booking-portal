import { BookingSearchComponent } from './booking-search/booking-search.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { P2cBookingCreateComponent } from './booking-create/p2c-booking-create/p2c-booking-create.component';
import { FreighterBookingCreateComponent } from './booking-create/freighter-booking-create/freighter-booking-create.component';

const routes: Routes = [
  { path: '', component: BookingListComponent},
  { path: 'p2cCreate', component: P2cBookingCreateComponent},
  { path: 'freighterCreate', component: FreighterBookingCreateComponent},
  { path: 'search', component: BookingSearchComponent},
  { path: 'search/:id', component: BookingSearchComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
