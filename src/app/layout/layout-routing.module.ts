import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared/index';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule',
            canActivate: [AuthGuard] },
            { path: 'system-users', loadChildren: './system-users/system-users.module#SystemUsersModule' },
            { path: 'university-transportation', loadChildren: './university-transportation/university-transportation.module#UniversityTransportationModule' }
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
