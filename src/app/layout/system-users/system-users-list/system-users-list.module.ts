import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemUsersListComponent } from './system-users-list.component';
import { SystemUsersListRoutingModule } from './system-users-list-routing.module';
import { PageHeaderModule, StatModule } from '../../../shared/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SystemUsersListGuard } from '../../../shared/guard/system-users-list.guard';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    SystemUsersListRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    StatModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,


  ],
  declarations: [SystemUsersListComponent],
  

})
export class SystemUsersListModule { }
