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
import { LoaderFlightComponent } from './components/loader-flight/loader-flight.component';
import { TwoDecimalpointsDirective } from '../directives/twodecimalpoints.directive';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { PagerComponent } from './components/pager/pager.component';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TableLoaderComponent } from './components/table-loader/table-loader.component';




@NgModule({
  declarations: [
    TextInputComponent,
    AutoCompleteDropdownComponent,
    WhiteSpaceInputComponent,
    LoaderFlightComponent,
    TwoDecimalpointsDirective,
    PagerComponent,
    PagingHeaderComponent,
    TableLoaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    AutocompleteLibModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    PaginationModule

  ],
  exports: [
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    AutoCompleteDropdownComponent,
    WhiteSpaceInputComponent,
    LoaderFlightComponent,
    TwoDecimalpointsDirective,
    NgxSpinnerModule,
    NgxPaginationModule,
    PagerComponent,
    PagingHeaderComponent,
    PaginationModule,
    TableLoaderComponent
  ],providers:[CryptoService]
})
export class SharedModule { }
