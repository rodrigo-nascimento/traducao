import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemUsersEditComponent } from './system-users-edit.component';
import { SystemUsersEditRoutingModule } from './system-users-edit-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxMaskModule} from 'ngx-mask';
import { SystemUsersService } from '../../../shared/services/system-users.service';
import { MaskService } from '../../../shared/services/mask-forms.service';

@NgModule({
  imports: [
    CommonModule,
    SystemUsersEditRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgxMaskModule.forRoot(),
  ],
  declarations: [SystemUsersEditComponent],
  
  providers:[SystemUsersService, MaskService]
})
export class SystemUsersEditModule { }
