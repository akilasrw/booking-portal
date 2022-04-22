import { BookingLookupSearchComponent } from './booking-lookup-search/booking-lookup-search.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BookingLookupSearchComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingLookupRoutingModule { }
