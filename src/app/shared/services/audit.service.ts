import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuditModels } from '../models/audit.models';

import { URL_AuthAPI, URL_OpenAPI } from '../../app.api';
import { SystemLogin } from '../models/system-login.model';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { headersToString } from 'selenium-webdriver/http';

/*
 * classe de serviços, possui métodos que realizam algum lógica -> conexão com o servidor
 * Injeção de dependencia : a linguagem ou framework, fornece uma instancia de uma classe
 * para que voce nao precise fazer a instanciação manualmente 
 */

@Injectable()
// a classe pode ser injetada em outra classe para que o uso dela possa ser feito
// serviços são injetáveis 
export class AuditService {

    public auditModels: AuditModels;

    constructor(private http: Http) { }

    public registerAudit(newAudit: AuditModels): Observable<AuditModels> {

        let headers: Headers = new Headers();
        headers.append('Content-type', 'application/json');

        return this.http.post(
            `${URL_OpenAPI}/cadAudit`,
            JSON.stringify(newAudit),
            new RequestOptions({ headers: headers }))
            .map((resposta: Response) => resposta.json());
    }

}

