import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { OrgContextService } from '../../../core/services/org-context.service';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule],
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
    private breadcrumbService = inject(BreadcrumbService);
    breadcrumbs$ = this.breadcrumbService.breadcrumbs$;

    private orgContext = inject(OrgContextService);


    routeToModule() {
        this.orgContext.navigateTo(['modules'])

    }
}
