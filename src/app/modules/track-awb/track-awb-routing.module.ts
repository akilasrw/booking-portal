import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwbSearchComponent } from './awb-search/awb-search.component';

const routes: Routes = [
  { path: '', component: AwbSearchComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackAwbRoutingModule { }
