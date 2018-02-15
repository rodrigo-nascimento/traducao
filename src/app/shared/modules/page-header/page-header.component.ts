import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

    @Input() titulo:string;
    @Input() rota: string;
    @Input() heading: string;
    @Input() icon: string;
    constructor() { }

    ngOnInit() {
    }
}
