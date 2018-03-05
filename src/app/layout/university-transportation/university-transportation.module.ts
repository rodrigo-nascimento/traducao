import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityTransportationComponent } from './university-transportation.component';
import { UniversityTransportationRoutingModule } from './university-transportation-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    UniversityTransportationRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UniversityTransportationComponent]
})
export class UniversityTransportationModule { }
