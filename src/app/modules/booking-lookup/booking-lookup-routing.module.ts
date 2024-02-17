import { BookingLookupSearchComponent } from './booking-lookup-search/booking-lookup-search.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BookingSearchComponent} from "../booking/booking-search/booking-search.component";

const routes: Routes = [
  { path: '', component: BookingLookupSearchComponent},
  { path: ':id', component: BookingLookupSearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingLookupRoutingModule { }
