import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    
    closeMenu() {
        (<HTMLInputElement> document.getElementById("chk")).checked = false; 
    }

    teste() {
        alert('foi!');
    }

}
