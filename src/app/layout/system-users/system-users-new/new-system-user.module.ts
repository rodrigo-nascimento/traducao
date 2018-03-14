import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewSystemUserComponent } from './new-system-user.component';
import { NewSystemUserRoutingModule } from './new-system-user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SystemUsersService } from '../../../shared/services/system-users.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import {NgxMaskModule} from 'ngx-mask';
import { PageHeaderModule, StatModule } from '../../../shared/index';
import { MaskService } from '../../../shared/services/mask-forms.service';
import { AuditService } from '../../../shared/services/audit.service';


@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    StatModule,
    NewSystemUserRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgxMaskModule.forRoot(),
    HttpModule
  ],
  declarations: [NewSystemUserComponent],
  
  providers:[SystemUsersService, MaskService, AuditService]
  // providers : fornecedor -> serviço fornecedor 
})
export class NewSystemUserModule { }
