import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    AccountRoutingModule,
    SharedModule,
  ]
})
export class AccountModule { }
