import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemUsersEditComponent } from './system-users-edit.component';
import { SystemUsersEditRoutingModule } from './system-users-edit-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxMaskModule} from 'ngx-mask';
import { PageHeaderModule, StatModule } from '../../../shared/index';
import { SystemUsersService } from '../../../shared/services/system-users.service';
import { MaskService } from '../../../shared/services/mask-forms.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    StatModule,
    SystemUsersEditRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule.forRoot(),
    NgxMaskModule.forRoot(),
  ],
  declarations: [SystemUsersEditComponent],
  
  providers:[SystemUsersService, MaskService]
})
export class SystemUsersEditModule { }
