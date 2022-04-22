import { BookingSearchComponent } from './booking-search/booking-search.component';
import { BookingCreateComponent } from './booking-create/booking-create.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BookingListComponent},
  { path: 'create/:id', component: BookingCreateComponent},
  { path: 'search', component: BookingSearchComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
