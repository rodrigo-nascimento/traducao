import { NgModule } from "@angular/core";
import { UniversityTransportationRoutingModule } from "./university-transportation-routing.module";
import { CommonModule } from "@angular/common";
import { PageHeaderModule, StatModule } from "../../shared/index";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxMaskModule } from "ngx-mask";
import { HttpModule } from "@angular/http";
import { UniversityTransportationComponent } from "./university-transportation.component";
import { MaskService } from "../../shared/services/mask-forms.service";
import { SystemUsersService } from "../../shared/services/system-users.service";


@NgModule({
  imports: [

    UniversityTransportationRoutingModule,
    CommonModule,
    PageHeaderModule,
    StatModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgxMaskModule.forRoot(),
    HttpModule
 
  ],
  declarations: [UniversityTransportationComponent],
  providers:[ MaskService, SystemUsersService]
})
export class UniversityTransportationModule { }
