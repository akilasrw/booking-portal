import { CargoRateModule } from './modules/cargo-rate/cargo-rate.module';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { SideNavComponent } from './core/components/side-nav/side-nav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { RouteConstants } from './core/constants/constants';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: RouteConstants.DefaultRoute, redirectTo: 'home', pathMatch: 'full' },
  { path: RouteConstants.AccountRoute, loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule) },
  { path: RouteConstants.BookingInformationRoute, loadChildren: () => import('./modules/booking/booking.module').then(mod => mod.BookingModule), canActivate: [AuthGuard] },
  { path: RouteConstants.DashboardRoute, loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule), canActivate: [AuthGuard] },
  { path: RouteConstants.BookingLookupRoute, loadChildren: () => import('./modules/booking-lookup/booking-lookup.module').then(mod => mod.BookingLookupModule), canActivate: [AuthGuard] },
  { path: RouteConstants.RateViewRoute, loadChildren: () => import('./modules/cargo-rate/cargo-rate.module').then(mod => mod.CargoRateModule), canActivate: [AuthGuard] },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
