import { RegistrationComponent } from './registration/registration.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../core/guards/login.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [LoginGuard]},
  { path: 'registration', component: RegistrationComponent, canActivate: [LoginGuard] },
  //{ path: 'register', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
