import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { SystemUsersService } from '../../../shared/services/system-users.service';
import { SystemUsers } from '../../../shared/models/system-users.model';
import { UsersDocuments } from '../../../shared/models/system-users-documents';
import { UsersAddress } from '../../../shared/models/system-users-address';
import { UsersPhone } from '../../../shared/models/system-users-phone';

@Component({
  selector: 'app-system-users-visualization',
  templateUrl: './system-users-visualization.component.html',
  styleUrls: ['./system-users-visualization.component.scss']
})
export class SystemUsersVisualizationComponent implements OnInit {
  public token: string = localStorage.getItem('token');
  @Input() id: string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  public phones = [];
  public addressArray = [];
  public formVisualization;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private systemUsersService: SystemUsersService
  ) {
    this.formVisualization = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null),
      rg: new FormControl(null),
      cpf: new FormControl(null),
      active: new FormControl(null),
      addresses: new FormGroup({}),
      phones: new FormGroup({
      })
    });

  }
  ngOnInit() {

    this.systemUsersService.getUser(this.id, this.token)
      .subscribe((user: SystemUsers) => {

        var active = "";
        if (user.active) active = "ATIVADO";
        else active = "DESATIVADO";

        this.formVisualization.controls.name.setValue(user.name);
        this.formVisualization.controls.email.setValue(user.email);
        this.formVisualization.controls.active.setValue(active);
        this.populaFormDocs(user.documents);
        this.populaFormEndereco(user.address);
        this.populaFormTelefone(user.phone);

      });
    console.log(this.formVisualization.value)

  }

  /* ----------------- Documents ----------------------- */
  private populaFormDocs(docsUser): void {
    var i: number;
    for (i = 0; i < docsUser.length; i++) {
      var document: UsersDocuments = docsUser[i];

      if (document.name === "CPF") {
        this.formVisualization.controls.cpf.setValue(document.value);
      }
      if (document.name === "RG") {
        this.formVisualization.controls.rg.setValue(document.value);
      }
    }
  }

  /* --------------------- Phones ---------------- */
  private populaFormTelefone(phoneUser): void {
    var i: number;
    for (i = 0; i < phoneUser.length; i++) {
      var phone: UsersPhone = phoneUser[i];

      this.phones.push(
        "phone" + i,
      );

      this.formVisualization.get("phones").addControl('phone' + i, new FormGroup({
        name: new FormControl({ value: phone.name, disabled: true }),
        number_phone: new FormControl({ value: phone.number_phone, disabled: true })
      }));


    }
  }
  /*  ---------------------- Addresses -------------------------------*/

  private populaFormEndereco(addressUser): void {
    var i: number;
    var address: UsersAddress;

    for (i = 0; i < addressUser.length; i++) {

      address = addressUser[i];

      this.addressArray.push(
        "address" + i,
      );

      this.formVisualization.get("addresses").addControl('address' + i, new FormGroup({
        name: new FormControl({ value: address.name, disabled: true }),
        street: new FormControl({ value: address.street, disabled: true }),
        number: new FormControl({ value: address.number, disabled: true }),
        complement: new FormControl({ value: address.complement, disabled: true }),
        neighborhood: new FormControl({ value: address.neighborhood, disabled: true }),
        zip_code: new FormControl({ value: address.zip_code, disabled: true }),
        city: new FormControl({ value: address.city, disabled: true }),
        state: new FormControl({ value: address.state, disabled: true })
      }));
    }

  }

  closeVisualization(): void {
    this.close.emit(null);
  }


}
