import { Component, OnInit } from '@angular/core';
import { SystemUsers } from '../../../shared/models/system-users.model';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemUsersService } from '../../../shared/services/system-users.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../../../router.animations';
import { Alert } from 'selenium-webdriver';
import { Title } from '@angular/platform-browser/src/browser/title';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'app-system-users-list',
  templateUrl: './system-users-list.component.html',
  styleUrls: ['./system-users-list.component.scss'],
  animations: [routerTransition()]
})
export class SystemUsersListComponent implements OnInit {

  public apiUser: SystemUsers[];
  public countApiUser: number = 0;
  public token: string = localStorage.getItem('token');

  public closeResult: string;
  public contentVisu: string;

  public userName: string;
  public userCpf: string;

  public quantPorPage: number = 10;
  public listaDePaginacao: any = [];
  public numeroDaPagina: number;
  public totalDeUsuarios: number;

  public visualization: boolean = false;
  public idVisualization: string;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private systemUsersService: SystemUsersService,
    

  ) { }


  ngOnInit() {
    this.userName = localStorage.getItem('name');
    this.userCpf = localStorage.getItem('cpf');

    this.main(1);
  }

  public array : Array<Object> = [
    
    { name: 'Users',
      path: '/system-users',
      icone: 'fa-users'
    },
    
    { name:'Listagem',
      path:'/system-users/systemUsersList',
      icone:'fa-list'
    }
  ]
  
  /* ***************** Busca **********************/
  public search(option, filter) {

    var objSearch: object = {
      campo: option,
      valor: filter
    };

    this.systemUsersService.search(this.token, objSearch)
      .subscribe((apiResponse: SystemUsers[]) => {

        this.apiUser = apiResponse;
        this.carregarListaDePaginas();
      }
    );
  }


  // Visualização do Usuário 
  public openVisualization(id): void {

    this.visualization = !this.visualization;
    this.idVisualization = id;
  }

  public closeVisualization(evento): void {

    this.visualization = !this.visualization;
  }


  /* ----------------------------------- Paginação -------------------------------------- */
  public paginar(pagina: number, $event: any) {

    $event.preventDefault();
    this.main(pagina);
  }

  public main(pagina: number): void {

    this.systemUsersService.countUser(this.token)
      .subscribe((apiResponse: number) => {

        this.totalDeUsuarios = apiResponse;
        this.numeroDaPagina = pagina;

        this.carregarListaDePaginas();
        this.listUsers(this.quantPorPage, this.numeroDaPagina);
      });
  }


  public listUsers(limit, pagina): void {

    let skip = ((pagina - 1) * this.quantPorPage);
    const obj = {

      limit: limit,
      skip: skip
    };

    this.systemUsersService.listUsers(this.token, obj)
      .subscribe((apiResponse: SystemUsers[]) => {
        this.apiUser = this.percorrer(apiResponse);
      });
  }

  public carregarListaDePaginas(): any {

    this.listaDePaginacao = [];
    let tamanhoDoArray = this.totalDeUsuarios / this.quantPorPage;
    let restoTamanhoDoArray = this.totalDeUsuarios % this.quantPorPage;

    if (restoTamanhoDoArray !== 0) {
      tamanhoDoArray = Math.ceil(tamanhoDoArray);
    }

    for (let i = 1; i <= tamanhoDoArray; i++) {
      this.listaDePaginacao.push(i);
    }
  }

  public percorrer(apiResponse): any {

    for (const elemento in apiResponse) {
      apiResponse = apiResponse[elemento];
    }

    return apiResponse;
  }



  /* ------------------------------------------ Métodos para editar e deletar o usuário ---------------------- */

  public editUsers(userE: SystemUsers) {
    // navegação por rota para outro componente 

    this.router.navigate(['/system-users/systemUsersEdit', userE._id]);
  }

   date = new Date;
  
  public deleteUser(user: SystemUsers): void {

    user.nameUser = this.userName;
    user.numberCpfUser = this.userCpf;
    user.date = this.date;
    user.ipUser = "192.168.1.1"
    user.session = "USUARIO ADMINISTRATIVO";
    user.description = "DELETOU USUARIO ADMINISTRATIVO";
   
    this.systemUsersService.deleteUser(user, this.token)
      .subscribe((apiResponse: SystemUsers) => {

        for (let i = 0; i < this.apiUser.length; i++) {
          this.countApiUser += 1;
        }

        if ((this.apiUser[0]._id === user._id) && (this.countApiUser === 1)) {
          this.main(this.numeroDaPagina - 1);
        } else {
          this.main(this.numeroDaPagina);
        }

      },
      (error: any) => {
        alert('Erro ao deletar o usuário')
        if (error._body === '{"errors":["Não foi possível deletar o usuário."]}') { }
      }
      );
  }

  public openDelete(content): void {

    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  public quantPorPagina(value: number): any {

    if (value > this.totalDeUsuarios) {
      this.quantPorPage = this.totalDeUsuarios;
      this.main(1);
    }
    else if (value === 0) {
      this.quantPorPage = this.totalDeUsuarios;
      this.main(1);
    }
    else {
      this.quantPorPage = value;
      this.main(1);
    }
  }

  /* ******************************* EDITA STATUS ******************************* */
  public trocaStatus(user): void {
    console.log(user.active)
    user.active = !user.active;
    console.log(user.active)
    this.systemUsersService.editUser(user, this.token)
      .subscribe((apiResponse: SystemUsers) => {
        this.router.navigateByUrl('/system-users/systemUsersList');
      }, (error: any) => {
        alert('ERROR: trocaStatus - 139L' + error);
        if (error._body === '{"errors":["Erro ao editar o usuário."]}') {

        }
      });

  }

}