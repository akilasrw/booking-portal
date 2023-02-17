import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SharedModule } from '../shared/shared.module';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { CustomPackageFilterPipe } from './pipes/custom-package-filter.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';



@NgModule({
  declarations: [
    NotFoundComponent,
    SideNavComponent,
    ServerErrorComponent,
    CustomPackageFilterPipe,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    SideNavComponent,
    TimeAgoPipe
  ]
})
export class CoreModule { }
