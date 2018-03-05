import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UniversityTransportationComponent } from './university-transportation.component';

const routes: Routes = [
    {
        path: '', component: UniversityTransportationComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniversityTransportationRoutingModule { }
