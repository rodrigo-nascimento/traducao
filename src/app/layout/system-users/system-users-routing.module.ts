import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemUsersComponent } from './system-users.component';
import { SystemUsersListGuard } from '../../shared/guard/system-users-list.guard';


const routes: Routes = [
    {
        path: '', component: SystemUsersComponent,
        children: [
            { path: '', redirectTo: 'systemUsersHome' },
            { path: 'systemUsersHome', loadChildren: './system-users-home/system-users-home.module#SystemUsersHomeModule' },
            { path: 'newSystemUser', loadChildren: './system-users-new/new-system-user.module#NewSystemUserModule' },
            { path: 'systemUsersEdit/:id', loadChildren: './system-users-edit/system-users-edit.module#SystemUsersEditModule' },
            { path: 'systemUsersList', loadChildren: './system-users-list/system-users-list.module#SystemUsersListModule',
        canActivateChild:[SystemUsersListGuard] }
        ]
    }

];

/**
 *  loadChildren -> carregando dos módulos sobre demanda 
 * 
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemUsersRoutingModule { }
