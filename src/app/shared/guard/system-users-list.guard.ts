import { CanActivateChild } from "@angular/router/src/interfaces";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class SystemUsersListGuard implements CanActivateChild {
    router: any;



    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        console.log('guard list')
        console.log(route);
        console.log(state)

        if(state.url.includes('systemUsers')){
            //pode fazer retornar falso para nao acessar as rotas 
            console.log('systemusers')
        }
        if(state.url.includes('systemUsersList')){
            console.log('listagem')
        }
        return true;
        //return this.permissions.canActivate(this.currentUser, route.params.id);
     //   return Observable.of(false); -> usado para retornar um observable como se chamasse um outro serviço que vai no servidor verificar se o usuário tem acesso a essa rota 
    }



}

