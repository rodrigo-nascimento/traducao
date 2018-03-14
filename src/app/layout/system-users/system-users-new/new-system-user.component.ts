
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SystemUsers } from '../../../shared/models/system-users.model';
//importação da classe de serviço
import { SystemUsersService } from '../../../shared/services/system-users.service';
import { UsersDocuments } from '../../../shared/models/system-users-documents';
import { UsersPhone } from '../../../shared/models/system-users-phone';
import { UsersAddress } from '../../../shared/models/system-users-address';
import { INVALID, DISABLED, FormArray } from '@angular/forms/src/model';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { error, IButton } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/opera';
import { RequiredValidator } from '@angular/forms/src/directives/validators';
import { MaskService } from '../../../shared/services/mask-forms.service';
import { AuditService } from '../../../shared/services/audit.service';
import { AuditModels } from '../../../shared/models/audit.models';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-system-user.component.html',
  styleUrls: ['./new-system-user.component.scss']
})
export class NewSystemUserComponent implements OnInit {

  public token: string = localStorage.getItem('token');
  public formNewUser;
  private idPhoneAtual = 0;
  private idEnderecoAtual = 0;
  public phones = [];
  public enderecos = [];
  public errorAddress: boolean = false;
  public textErrorAddress: string = "";

  public userName: string;
  public userCpf: string;

  //booleanas -> controla telas
  public personalData: boolean = true;
  public addresses: boolean = false;
  public contacts: boolean = false;
  public permissions: boolean = false;


  public modules: String[] = ["Administração Geral", "Transporte Universitário", "Módulo 3", "Módulo 4"];

  constructor(private router: Router, private systemUsersService: SystemUsersService,
    private auditService: AuditService, private maskService: MaskService) {

    this.formNewUser = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)], ),
      rg: new FormControl(null),
      cpf: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11),
      Validators.pattern(/^[0-9]{11}$/)]),
      active: new FormControl(null),
      enderecos: new FormGroup({}),
      phones: new FormGroup({})
    });
  }
  // injeção de dependencia feita no construtor


  ngOnInit() {

    this.userName = localStorage.getItem('name');
    this.userCpf = localStorage.getItem('cpf');

    this.formNewUser.active = true;
    this.formNewUser.controls.active.setValue("ATIVADO");
  }

  public array : Array<Object> = [
    { 
      name: 'Users',
      path: '/system-users',
      icone: 'fa-home'
    },
    { 
      name: 'Cadastrar',
      path: '/system-users/newSystemUser',
      icone: 'fa-user-plus'
    }
  ]

  /* ---------------------- Utilitários --------------------------------------- */
  closeAlert(id) {
    document.getElementById(id).remove();
  }
  getMask(typeField): string {
    return this.maskService.getMask(typeField);
  }

  defineStatus() {

    this.formNewUser.active = !this.formNewUser.active;
    if (this.formNewUser.active == false) {
      this.formNewUser.controls.active.setValue("DESATIVADO");
    } else {
      this.formNewUser.controls.active.setValue("ATIVADO");
    }
  }

  public openVisualizationForms(step, action) {

    if (step == 'personalData' && action == 'next') {

      this.personalData = false;
      this.addresses = true;

    } else if (step == 'addresses') {

      this.addresses = false;

      if (action == 'previous') {
        this.personalData = true;
      } else if (action == 'next') {
        this.contacts = true;
      }

    } else if (step == 'contacts') {

      this.contacts = false;

      if (action == 'previous') {
        this.addresses = true;
      } else if (action == 'next') {
        this.permissions = true;
      }

    } else if (step == 'permissions') {

      this.permissions = false;

      if (action == 'previous') {
        this.contacts = true;
      }

    }

  }
  /* ------------------------- Validação CPF e EMAIL ------------------------------ */

  public validaAtributos(campo: string): void {

    let objectField: object;
    objectField = {
      "campo": campo,
      "valor": this.formNewUser.get(campo).value
    }

    this.systemUsersService.validateFields(objectField, this.token)
      .subscribe((apiResponse: SystemUsers) => {
        if ((apiResponse.length > 0)) {
          alert(' Já cadastrado no sistema, informe um valor válido');
          this.formNewUser.get(campo).setValue('');

        }
      }, (error: any) => {
        alert('Erro na validação de cpf e email')

      });
  }

  /* ----------------------------------- Telefones ------------------------ */
  public removePhoneOfForm(phone): void {

    for (var i = 0; i < this.phones.length && this.phones[i] != phone; i++);

    this.phones.splice(i, 1);
    this.formNewUser.get("phones").removeControl(phone);
  }

  public addPhoneToForm(phoneType): void {
    if (phoneType != "INVALID") {

      var length;

      if (phoneType == 'RESIDENCIAL' || phoneType == 'COMERCIAL' || phoneType == "FIXO-RECADO") {
        length = 10;
      } else {
        length = 11;
      }

      this.phones.push(
        "phone" + this.idPhoneAtual,
      );

      this.formNewUser.get("phones").addControl('phone' + this.idPhoneAtual, new FormGroup({
        phoneName: new FormControl(phoneType),
        numberPhone: new FormControl(null,
          [Validators.required, Validators.minLength(length), Validators.maxLength(length)])
      }));
      this.idPhoneAtual = this.idPhoneAtual + 1;
    }
    else {
      alert('Telefone Inválido')
    }

  }
  /* ----------------------------------- Telefones ------------------------ */

  // valida contra erros, busca o cep e adiciona o endereço com mas informações no form-control
  public buscaCep(typeField, inputCep): void {

    inputCep = inputCep.replace(/\D/g, '');
    var validaCep = /^[0-9]{8}$/;

    if (typeField == "INVALID" && inputCep == "") {

      this.textErrorAddress = "Selecione um tipo de endereço válido e informe o CEP";
      this.errorAddress = true;
    } else if (typeField == "INVALID") {

      this.textErrorAddress = "Selecione um tipo de endereço válido";
      this.errorAddress = true;
    } else if (inputCep == "") {

      this.textErrorAddress = "Informe o CEP";
      this.errorAddress = true;
    } else if (validaCep.test(inputCep) == false) {

      this.textErrorAddress = "Informe o CEP com 9 dígitos, formato : 00000-000";
      this.errorAddress = true;
    }

    else {
      this.systemUsersService.findCep(inputCep).subscribe((dados: object) => {

        if (!("erro" in dados)) {
          const address: any = dados;
          this.enderecos.push(
            "endereco" + this.idEnderecoAtual,
          );

          this.formNewUser.get("enderecos").addControl('endereco' + this.idEnderecoAtual, new FormGroup({
            name: new FormControl({ value: typeField, disabled: true }),
            street: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            number: new FormControl(null, [Validators.required, Validators.minLength(1)]),
            complement: new FormControl(null),
            neighborhood: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            zip_code: new FormControl({ value: inputCep, disabled: true }),
            city: new FormControl({ value: address.localidade, disabled: true }, [Validators.required]),
            state: new FormControl({ value: address.uf, disabled: true }, [Validators.required])
          }));

          this.idEnderecoAtual = this.idEnderecoAtual + 1;
          console.log(this.formNewUser.value)

        } else {
          this.textErrorAddress = "Erro ao buscar o CEP no servidor";
          this.errorAddress = true;
        }
      });
    }

  }

  public removeAddressOfForm(endereco): void {

    for (var i = 0; i < this.enderecos.length && this.enderecos[i] != endereco; i++);
    this.enderecos.splice(i, 1);
    this.formNewUser.get("enderecos").removeControl(endereco);

  }

  /* -------------------------------- Submissão ------------------------------------- */

  public onSubmit(): void {
    var address: Array<UsersAddress> = new Array();
    var phones: Array<UsersPhone> = new Array();

    const phonesControl = this.formNewUser.controls.phones; // controle dos telefones
    const addressControl = this.formNewUser.controls.enderecos; // controle dos endereços


    for (const controls in this.formNewUser.get('phones').controls) {
      // loop -> constante string com o nome do controle

      phones.push({
        name: phonesControl.get(controls).get('phoneName').value,
        number_phone: phonesControl.get(controls).get('numberPhone').value
      });
    }

    for (const controls in this.formNewUser.get('enderecos').controls) {
      // loop -> constante string com o nome do controle
      address.push({
        name: addressControl.get(controls).get('name').value,
        street: addressControl.get(controls).get('street').value,
        number: addressControl.get(controls).get('number').value,
        complement: addressControl.get(controls).get('complement').value,
        neighborhood: addressControl.get(controls).get('neighborhood').value,
        zip_code: addressControl.get(controls).get('zip_code').value,
        city: addressControl.get(controls).get('city').value,
        state: addressControl.get(controls).get('state').value
      });
    }

    var date = new Date;
    var newUser: SystemUsers = new SystemUsers(

      this.formNewUser.value.name,
      this.formNewUser.value.email,
      this.formNewUser.value.password,
      '',
      [
        { name: "CPF", value: this.formNewUser.value.cpf },
        { name: "RG", value: this.formNewUser.value.rg }
      ],
      address,
      phones,
      this.formNewUser.active,
      this.userName,
      this.userCpf,
      date,
      '193.168.1.1', // Terá que ver um jeito de pegar o IP da maquina do usuario
      'USUARIO ADMINISTRATIVO', // Terá que ver um jeito de pegar a sessão que o usuario está utilizando
      'CADASTROU USUARIO ADMINISTRATIVO' // Ficará fixo, pois todas as funções do CRUD terá, então é só alterar em cada função

    );


    this.systemUsersService.registerUsersAdm(newUser, this.token)
      .subscribe((apiResponse: SystemUsers) => {

        alert('Usuário Cadastrado com sucesso!');
        this.router.navigateByUrl('/system-users/systemUsersHome'); //ROTEAMENTO

      }, (error: any) => {

        alert('erro na submissão do cadastro de usuário')

        if (error._body === '{"errors":["Usuário já cadastrado."]}') {
          alert('Já cadastrado')
        }

      });
  }
}