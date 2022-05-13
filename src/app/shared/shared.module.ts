import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/forms/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { CryptoService } from './services/crypto.service';
import { AutoCompleteDropdownComponent } from './components/auto-complete-dropdown/auto-complete-dropdown.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { WhiteSpaceInputComponent } from './components/forms/white-space-input/white-space-input.component';



@NgModule({
  declarations: [
    TextInputComponent,
    AutoCompleteDropdownComponent,
    WhiteSpaceInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    AutocompleteLibModule
  ],
  exports: [
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    AutoCompleteDropdownComponent,
    WhiteSpaceInputComponent
  ],providers:[CryptoService]
})
export class SharedModule { }
