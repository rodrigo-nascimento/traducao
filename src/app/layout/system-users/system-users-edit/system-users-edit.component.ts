import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SystemUsers } from '../../../shared/models/system-users.model';
import { SystemUsersService } from '../../../shared/services/system-users.service';
import { UsersDocuments } from '../../../shared/models/system-users-documents';
import { UsersAddress } from '../../../shared/models/system-users-address';
import { UsersPhone } from '../../../shared/models/system-users-phone';
import { Router, ActivatedRoute } from '@angular/router';
import { $$ } from 'protractor';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { MaskService } from '../../../shared/services/mask-forms.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './system-users-edit.component.html',
  styleUrls: ['./system-users-edit.component.scss']
})
export class SystemUsersEditComponent implements OnInit {

  public token: string = localStorage.getItem('token');
  public id: string;
  public user: SystemUsers;
  public inscricao: Subscription;
  private idPhoneAtual = 0;
  private idEnderecoAtual = 0;
  public phones = [];
  public enderecos = [];
  public errorAddress: boolean = false;
  public textErrorAddress: string = "";
  public formEditUser;

  public userName: string;
  public userCpf: string;

  public personalData: boolean = true;
  public addresses: boolean = false;
  public contacts: boolean = false;
  public permissions: boolean = false;

  constructor(public route: ActivatedRoute, public router: Router, private systemUsersService: SystemUsersService, private maskService: MaskService) {
    this.formEditUser = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)], ),
      rg: new FormControl(null),
      cpf: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11),
      Validators.pattern(/^[0-9]{11}$/)]),
      active: new FormControl(null),
      enderecos: new FormGroup({}),
      phones: new FormGroup({}),
    });
  }

  ngOnInit() {

    this.userName = localStorage.getItem('name');
    this.userCpf = localStorage.getItem('cpf');

    // inscricao para escutar mudanças na rota 
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.id = params['id'];
    });

    this.systemUsersService.getUser(this.id, this.token)
      .subscribe((userEdit: SystemUsers) => {
        this.user = userEdit;
        this.formEditUser.controls.name.setValue(this.user.name);
        this.formEditUser.controls.email.setValue(this.user.email);

        if (this.user.active == true) {
          this.formEditUser.active = true;
          this.formEditUser.controls.active.setValue("ATIVADO");
        } else if (this.user.active == false) {
          this.formEditUser.active = false;
          this.formEditUser.controls.active.setValue("DESATIVADO");
        }

        this.populaFormDocs(this.user.documents);
        this.populaFormTelefone(this.user.phone);
        this.populaFormEndereco(this.user.address);
      });
  }
  ngOnDestroy() {
    //desinscrevendo da inscrição
    this.inscricao.unsubscribe();
  }

  /* ---------------------- Utilitários --------------------------------------- */
  public closeAlert(id): void {
    document.getElementById(id).remove();
  }
  public getMask(typeField): string {
    return this.maskService.getMask(typeField);
  }

  public defineStatus(): void {

    this.formEditUser.active = !this.formEditUser.active;
    if (this.formEditUser.active == false) {
      this.formEditUser.controls.active.setValue("DESATIVADO");
    } else {
      this.formEditUser.controls.active.setValue("ATIVADO");
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
      "valor": this.formEditUser.get(campo).value
    }

    this.systemUsersService.validateFields(objectField, this.token)
      .subscribe((apiResponse: SystemUsers) => {

        if ((apiResponse.length > 0)) {
          alert(' Já cadastrado no sistema, informe um valor válido');
          this.formEditUser.get(campo).setValue('');

        }
      }, (error: any) => {
        alert('Erro na validação de cpf e email')

      });
  }

  /* -------Pegando dados do usuario e populando o formulário ----------------- */

  //Documentos
  private populaFormDocs(docsUser): void {
    var i: number;
    for (i = 0; i < docsUser.length; i++) {
      var document: UsersDocuments = docsUser[i];

      if (document.name === "CPF") {
        this.formEditUser.controls.cpf.setValue(document.value);
      }
      if (document.name === "RG") {
        this.formEditUser.controls.rg.setValue(document.value);
      }
    }
  }

  //Endereço
  private populaFormEndereco(addressUser): void {
    var i: number;
    for (i = 0; i < addressUser.length; i++) {
      var address: UsersAddress = addressUser[i];

      this.enderecos.push(
        "endereco" + i,
      );
      this.formEditUser.get("enderecos").addControl('endereco' + i, new FormGroup({
        name: new FormControl({ value: address.name, disabled: true }),
        street: new FormControl(address.street, [Validators.required, Validators.minLength(5)]),
        number: new FormControl(address.number, [Validators.required, Validators.minLength(1)]),
        complement: new FormControl(address.complement),
        neighborhood: new FormControl(address.neighborhood, [Validators.required, Validators.minLength(5)]),
        zip_code: new FormControl({ value: address.zip_code, disabled: true }),
        city: new FormControl({ value: address.city, disabled: true }, [Validators.required]),
        state: new FormControl({ value: address.state, disabled: true }, [Validators.required])
      }));

    }
    this.idEnderecoAtual = i;
  }
  //Telefone 
  private populaFormTelefone(phoneUser): void {

    var i: number;

    for (i = 0; i < phoneUser.length; i++) {
      var phone: UsersPhone = phoneUser[i];
      this.addPhoneToForm(phone.name);
      this.formEditUser.get("phones").get('phone' + (this.idPhoneAtual)).get('numberPhone').setValue(phone.number_phone);
    }
  }

  /* ----------------------- Remove e adiciona telefone do formulário -------------- */

  public removePhoneOfForm(phone): void {

    for (var i = 0; i < this.phones.length && this.phones[i] != phone; i++);
    this.phones.splice(i, 1);
    this.formEditUser.get("phones").removeControl(phone);
  }

  public addPhoneToForm(phoneType): void {
    if (phoneType != "INVALID") {
      this.idPhoneAtual = this.idPhoneAtual + 1;
      var length;

      if (phoneType == 'RESIDENCIAL' || phoneType == 'COMERCIAL' || phoneType == "FIXO-RECADO") {
        length = 10;
      } else {
        length = 11;
      }
      this.phones.push(
        "phone" + this.idPhoneAtual,
      );

      this.formEditUser.get("phones").addControl('phone' + this.idPhoneAtual, new FormGroup({
        phoneName: new FormControl(phoneType),
        numberPhone: new FormControl(null,
          [Validators.required, Validators.minLength(length), Validators.maxLength(length)])
      }));

    }
    else {
      alert('Telefone Inválido')
    }
  }


  /*  ---------------------- Remove e adiciona endereço do formulario  -------------------------------*/
  public removeAddressOfForm(endereco): void {
    for (var i = 0; i < this.enderecos.length && this.enderecos[i] != endereco; i++);
    this.enderecos.splice(i, 1);
    this.formEditUser.get("enderecos").removeControl(endereco);
  }


  public addAddressToForm(address, typeField, inputCep): void {

    this.idEnderecoAtual = this.idEnderecoAtual + 1;

    this.enderecos.push(
      "endereco" + this.idEnderecoAtual,
    );

    this.formEditUser.get("enderecos").addControl('endereco' + this.idEnderecoAtual, new FormGroup({
      name: new FormControl({ value: typeField, disabled: true }),
      street: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      number: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      complement: new FormControl(null),
      neighborhood: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      zip_code: new FormControl({ value: inputCep, disabled: true }),
      city: new FormControl({ value: address.localidade, disabled: true }, [Validators.required]),
      state: new FormControl({ value: address.uf, disabled: true }, [Validators.required])
    }));

  }
  /* ------------------- Buscar Cep ---------------------------------- */
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

          this.addAddressToForm(dados, typeField, inputCep);
        } else {

          this.textErrorAddress = "Erro ao buscar o CEP no servidor";
          this.errorAddress = true;
        }
      });
    }
  }

  /* -------------------------------- Submissão ------------------------------------- */

  public onSubmitEditUser(): void {
    var address: Array<UsersAddress> = new Array();
    var phones: Array<UsersPhone> = new Array();

    const phonesControl = this.formEditUser.controls.phones; // controle dos telefones 
    const addressControl = this.formEditUser.controls.enderecos; // controle dos endereços 


    for (const controls in this.formEditUser.get('phones').controls) {
      // loop -> constante string com o nome do controle 

      phones.push({
        name: phonesControl.get(controls).get('phoneName').value,
        number_phone: phonesControl.get(controls).get('numberPhone').value
      });
    }

    for (const controls in this.formEditUser.get('enderecos').controls) {
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

    this.user.name = this.formEditUser.value.name;
    this.user.email = this.formEditUser.value.email;
    this.user.active = this.formEditUser.active;
    this.user.documents = [
      { name: "CPF", value: this.formEditUser.value.cpf },
      { name: "RG", value: this.formEditUser.value.rg }
    ];
    this.user.address = address;
    this.user.phone = phones;
    this.user.nameUser = this.userName;
    this.user.numberCpfUser = this.userCpf;
    this.user.date = date;
    this.user.ipUser = "193.168.1.1";  // Terá que ver um jeito de pegar o IP da maquina do usuario
    this.user.session = "USUARIO ADMINISTRATIVO"; // Terá que ver um jeito de pegar a sessão que o usuario está utilizando
    this.user.description = "EDITOU USUARIO ADMINISTRATIVO" ; // TESTE: + this.user.name + "CPF: " + this.formEditUser.value.cpf // Ficará fixo, pois todas as funções do CRUD terá, então é só alterar em cada função


    this.systemUsersService.editUser(this.user, this.token)
      .subscribe((apiResponse: SystemUsers) => {

        console.log(this.user)

        alert('Usuário editado com sucesso!');
        this.router.navigateByUrl('/system-users/systemUsersList');

      }, (error: any) => {

        console.log(error);

        if (error._body === '{"errors":["Erro ao editar o usuário."]}') {

        }

      });
  }
}
