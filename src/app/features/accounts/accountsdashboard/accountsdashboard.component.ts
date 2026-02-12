import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-accountsdashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './accountsdashboard.component.html',
    styleUrl: './accountsdashboard.component.scss'
})
export class AccountsdashboardComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
