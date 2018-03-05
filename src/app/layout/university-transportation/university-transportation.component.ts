import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-university-transportation',
  templateUrl: './university-transportation.component.html',
  styleUrls: ['./university-transportation.component.scss'],
  animations: [routerTransition()]
})
export class UniversityTransportationComponent implements OnInit {

  constructor() { }

  public formNewUser;

  ngOnInit() {
    this.formNewUser = new FormGroup({

      profession: new FormControl(null), // estudante ou professor 
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)], ),
      cpf: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11),
      Validators.pattern(/^[0-9]{11}$/)]),
      rg: new FormGroup({
        number: new FormControl(null),
        state: new FormControl(null, [Validators.maxLength(2), Validators.pattern(/[a-zA-Z]/)]),
        date: new FormControl(null)
      }),
      bloodType: new FormControl(null),
      motherSname: new FormControl(null),
      phone: new FormControl(null),
      address: new FormGroup({
        street: new FormControl(null),
        number: new FormControl(null),
        neighborhood: new FormControl(null)
      }),
      institution : new FormGroup({
        name : new FormControl(null),
        city : new FormControl (null),
        course : new FormControl(null),
        startYear : new FormControl(null),
        yearTermination : new FormControl(null)
      })
    });
  }

  public daysOfTheWeek: String[] = ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]
  public visualizationPessoais: boolean = true;
  public visualizationEnd: boolean = false;
  public visualizationInsti: boolean = false;
  public visualizationDoc: boolean = false;


  //**************************PROXIMO ************************* */
  public openVisualizationForms(step, action) {

    if (step == 'personalData' && action == 'next') {

      this.visualizationPessoais = false;
      this.visualizationEnd = true;

    } else if (step == 'address') {

      this.visualizationEnd = false;

      if (action == 'previous') {
        this.visualizationPessoais = true;
      } else if (action == 'next') {
        this.visualizationInsti = true;
      }

    } else if (step == 'institution') {

      this.visualizationInsti = false;

      if (action == 'previous') {
        this.visualizationEnd = true;
      } else if (action == 'next') {
        this.visualizationDoc = true;
      }

    } else if (step == 'documents') {

      this.visualizationDoc = false;

      if (action == 'previous') {
        this.visualizationInsti = true;
      }

    }

  }
  /*  public openVisualizationInsti() {
     this.visualizationEnd = false;
     this.visualizationInsti = true;
   }
   public openVisualizationDoc() {
     this.visualizationInsti = false;
     this.visualizationDoc = true;
   }


  public openVisualizationInstAnt() {
    this.visualizationDoc = false;
    this.visualizationInsti = true;
  }
  public openVisualizationEndAnt() {
    this.visualizationInsti = false;
    this.visualizationEnd = true;
  }
  public openVisualizationPessoaisAnt() {
    this.visualizationEnd = false;
    this.visualizationPessoais = true;
  }
  */
}
