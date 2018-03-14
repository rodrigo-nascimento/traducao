import { Component, OnInit, group, Directive } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { routerTransition } from '../../router.animations';
import { jsonpFactory } from '@angular/http/src/http_module';
import { Url } from 'url';
import { MaskService } from '../../shared/services/mask-forms.service';
import { SystemUsers } from '../../shared/models/system-users.model';
import { Router } from '@angular/router';
import { SystemUsersService } from '../../shared/services/system-users.service';
import { UsersAddress } from '../../shared/models/system-users-address';
import { UsersPhone } from '../../shared/models/system-users-phone';
import { SystemUserUniversityTransportation } from '../../shared/models/system-users-university-transportation.model';
import { UniversityTransportation } from '../../shared/models/universityTransportation.model';
import { Institution } from '../../shared/models/institution.model';
import { UsersDocuments } from '../../shared/models/system-users-documents';
import { Pipe } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-university-transportation',
  templateUrl: './university-transportation.component.html',
  styleUrls: ['./university-transportation.component.scss'],
  animations: [routerTransition()]
})


export class UniversityTransportationComponent implements OnInit {


  public token: string = localStorage.getItem('token');

  public daysOfTheWeek: Array<Object>;
  public institutions: String[] = ["Escolha uma instituição", "UFMS", "IFMS", "AEMS", "FUNEC", "FEA", "FIU", "FIRB"];
  public bloodTypes: String[] = ["Não sei informar", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  public citysInstitution: String[] = ["Escolha uma cidade", "TRÊS LAGOAS - MS", "PEREIRA BARRETO - SP", "ANDRADINA - SP", "SANTA FÉ DO SUL - SP"];
  public phoneTypes: String[] = ["Tipo", "RESIDENCIAL", "CELULAR"];
  public timeToGoInstitution;
  public timeToBackInstitution;
  public visualizationPessoais: boolean = true;
  public visualizationEnd: boolean = false;
  public visualizationInsti: boolean = false;
  public visualizationDoc: boolean = false;
  public visualizationSave: boolean = false;

  public formNewUser;
  public classPersonalData = "is-current";
  public classAddress = "";
  public classInstitution = "";
  public classDocuments = "";
  public classSave = "";
  public textPersonalData = "Passo Atual:";
  public textAddress = "";
  public textInstitution = "";
  public textDocuments = "";
  public textSave = "";


  constructor(private router: Router, private systemUsersService: SystemUsersService
  , private maskService : MaskService) {



  }


  ngOnInit() {

    this.daysOfTheWeek = [{ index: 0, name: "Segunda-Feira" },
    { index: 1, name: "Terça-Feira" },
    { index: 2, name: "Quarta-Feira" },
    { index: 3, name: "Quinta-Feira" },
    { index: 4, name: "Sexta-Feira" },
    { index: 5, name: "Sábado" }];


    console.log(this.daysOfTheWeek)


    this.timeToGoInstitution = new Array(6);
    this.timeToBackInstitution = new Array(6);


    for (var i = 0; i < 6; i++) {
      this.timeToGoInstitution[i] = new Array(4);
      this.timeToBackInstitution[i] = new Array(4);
      for (var j = 0; j < 4; j++) {
        this.timeToGoInstitution[i][j] = false;
        this.timeToBackInstitution[i][j] = false;
      }
    }

    console.log(this.timeToGoInstitution);
    console.log(this.timeToBackInstitution);

    this.formNewUser = new FormGroup({

      personalData: new FormGroup({
        student: new FormControl(true),
        teacher: new FormControl(false),
        name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)], ),
        cpf: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11),
        Validators.pattern(/^[0-9]{11}$/)]),
        rg: new FormGroup({
          number: new FormControl(null, Validators.required),
          date: new FormControl(null, Validators.required),
          state: new FormControl(null, [Validators.minLength(2), Validators.pattern(/[a-zA-Z]/)]),
        }),
        bloodType: new FormControl("Não sei informar", Validators.required), //inicia com um valor
        motherSname: new FormControl(null, Validators.required),
        phone: new FormGroup({
          name: new FormControl(null, Validators.required),
          numberPhone: new FormControl(null, Validators.required),
        })
      }),

      address: new FormGroup({
        street: new FormControl(null, Validators.required),
        number: new FormControl(null, Validators.required),
        neighborhood: new FormControl(null, Validators.required)
      }),
      institution: new FormGroup({
        name: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        course: new FormControl(null, Validators.required),
        startYear: new FormControl(null, Validators.required),
        yearTermination: new FormControl(null, Validators.required),


      }),


    });



  }

  
  getMask(typeField): string {

  return this.maskService.getMask(typeField);
  } 
 
  //**************************PROXIMO ************************* */
  public openVisualizationForms(step, action) {

    if (step == 'personalData' && action == 'next') {

      var pD = this.formNewUser.get('personalData');
      console.log(pD)
      console.log(pD.valid);

      if (pD.valid) {
        this.textPersonalData = "Completo: ";
        this.classPersonalData = "is-complete";

      } else {
        this.textPersonalData = "Erro: ";
        this.classPersonalData = "has-error";

      }
      this.textAddress = "Passo Atual: ";
      this.classAddress = "is-current";

      this.visualizationPessoais = false;
      this.visualizationEnd = true;

    } else if (step == 'address') {

      var pA = this.formNewUser.get('address');
      console.log(pA)
      console.log(pA.valid);

      this.visualizationEnd = false;

      if (pA.valid) {
        this.textAddress = "Completo: ";
        this.classAddress = "is-complete";

      } else {
        this.textAddress = "Erro: ";
        this.classAddress = "has-error";

      }

      if (action == 'previous') {

        this.visualizationPessoais = true;
        this.textPersonalData = "Passo Atual: ";
        this.classPersonalData = "is-current";

      } else if (action == 'next') {

        this.visualizationInsti = true;
        this.textInstitution = "Passo Atual: ";
        this.classInstitution = "is-current";

      }



    } else if (step == 'institution') {
      var pI = this.formNewUser.get('institution');
      console.log(pI)
      console.log(pI.valid);

      this.visualizationInsti = false;

      if (pI.valid) {
        this.textInstitution = "Completo: ";
        this.classInstitution = "is-complete"

      }
      else {
        this.textInstitution = "Erro: ";
        this.classInstitution = "has-error";

      }

      if (action == 'previous') {

        this.visualizationEnd = true;
        this.textAddress = "Passo Atual: ";
        this.classAddress = "is-current";

      } else if (action == 'next') {

        this.visualizationDoc = true;
        this.textDocuments = "Passo Atual: ";
        this.classDocuments = "is-current";
      }

    } else if (step == 'documents') {

      // FALTA O CONTROLE VALIDAÇÃO
      this.visualizationDoc = false;

      //ARRUMAR 
      this.textDocuments = "";
      this.classDocuments = "";
      if (action == 'previous') {
        this.visualizationInsti = true;
        this.textInstitution = "Passo Atual: ";
        this.classInstitution = "is-current";
      }

      if (action == 'next') {
        this.visualizationSave = true;
        this.textInstitution = "Passo Atual: ";
        this.classSave = "is-current";
      }
    } else if (step == 'save') {
      this.visualizationSave = false;

      this.textSave = "";
      this.classSave = "";

      if (action == 'previous') {
        this.visualizationDoc = true;
        this.textDocuments = "Passo Atual: ";
        this.classDocuments = "is-current";
      }


    }

  }
  public setValueBloodType(blood) {
    // todos tipos sao validos, pq "NAO SEI INFORMAR" tbm é um tipo valido
    var form = this.formNewUser.get('personalData').get('bloodType');
    form.value = blood;
    form.markAsTouched();
    form.updateValueAndValidity();
    console.log(this.formNewUser.value);


  }
  public setValueInstitution(inst) {

    var form = this.formNewUser.get('institution').get('name');

    if (inst != 'Escolha uma instituição') {

      form.value = inst;

    } else {
      form.value = null;
    }

    form.markAsTouched(); // marcando que foi "tocado" -> faz parte da validação
    form.updateValueAndValidity(); // lançando evento para "confirmar" as alterações feitas acima


  }
  public setValueCity(city) {

    var form = this.formNewUser.get('institution').get('city')
    if (city != 'Escolha uma cidade') {

      form.value = city;
    }
    else {
      form.value = null;
    }

    form.markAsTouched();
    form.updateValueAndValidity();
    console.log(form.value);

  }

  public setValuePhoneType(phone) {

    var form = this.formNewUser.get('personalData').get('phone').get('name');
    if (phone != 'Tipo') {

      form.value = phone;
    }
    else {
      form.value = null;
    }

    form.markAsTouched();
    form.updateValueAndValidity();
    console.log(form.value);

  }
  public visualizarRg(file): void {

    window.open(window.URL.createObjectURL(file));



  }


  public setValuetimeToGoInstitution(i, j) {
    this.timeToGoInstitution[i][j] = !this.timeToGoInstitution[i][j];
   
  }

  public setValuetimeToBackInstitution(i, j) {
    this.timeToBackInstitution[i][j] = !this.timeToBackInstitution[i][j];
   
  }
  public onSubmit(): void {
    var documents: Array<UsersDocuments> = new Array();


    const phonesControl = this.formNewUser.controls.personalData.controls.phone; // controle dos telefones
    const addressControl = this.formNewUser.controls.address; // controle dos endereços
    var personalDataControl = this.formNewUser.controls.personalData;
    var institutionControl = this.formNewUser.controls.institution;
    var profession;


    documents.push({ name: "CPF", value: personalDataControl.get('cpf').value, expeditionDate: null, state: null });
    documents.push({ name: "RG", value: personalDataControl.get('rg').get('number').value, expeditionDate: personalDataControl.get('rg').get('date').value, state: personalDataControl.get('rg').get('state').value });

    if (personalDataControl.get('teacher').value) {
      profession = "PROFESSOR";
    }
    if (personalDataControl.get('student').value) {
      profession = "ESTUDANTE";
    }


    var newUserU: SystemUserUniversityTransportation = new SystemUserUniversityTransportation(

      personalDataControl.get('name').value,
      personalDataControl.get('email').value,
      '',
      '',
      // personalDataControl.get('login').value,
      //personalDataControl.get('password').value,
      '',
      documents,
      [{ //ADDRESS
        name: 'RESIDENCIAL',
        street: addressControl.get('street').value,
        number: addressControl.get('number').value,
        complement: null,
        neighborhood: addressControl.get('neighborhood').value,
        zip_code: '15385000',
        city: 'Ilha Solteira',
        state: 'SP'
      }],
      [{ //PHONE
        name: phonesControl.get('name').value,
        number_phone: phonesControl.get('numberPhone').value
      }],
      this.formNewUser.active,
      new UniversityTransportation(
        profession,
        personalDataControl.value.bloodType,
        personalDataControl.value.motherSname,
        new Institution(
          institutionControl.get('name').value,
          institutionControl.get('city').value,
          institutionControl.get('course').value,
          institutionControl.get('startYear').value,
          institutionControl.get('yearTermination').value,
          this.timeToGoInstitution,
          this.timeToBackInstitution
        )
      )
    );

    console.log(newUserU);
     this.systemUsersService.registerUsersAdmTransporte(newUserU, this.token)
      .subscribe((apiResponse: SystemUserUniversityTransportation) => {


        alert('Usuário Cadastrado com sucesso!');
        this.router.navigateByUrl('/system-users/systemUsersHome'); //ROTEAMENTO
      }, (error: any) => {

        alert('erro na submissão do cadastro de usuário')
        console.log(error)
        if (error._body === '{"errors":["Usuário já cadastrado."]}') {
          alert('Já cadastrado')
        }

      }); 
  }

}