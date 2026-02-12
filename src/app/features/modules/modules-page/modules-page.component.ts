import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrgContextService } from '../../../core/services/org-context.service';
import { ModulesService } from '../modules.service';
import { StyModule } from '../modules.interface';
import { AuthService } from '../../../core/api-services/auth/auth.service';


/**
 * Modules Page Component
 * 
 * Displays available modules in the BizArabia ERP system
 * Allows users to view, manage, and configure modules
 * 
 * Layout: Header only (no sidebar)
 */
@Component({
  selector: 'app-modules-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modules-page.component.html',
  styleUrl: './modules-page.component.scss',
})
export class ModulesPageComponent implements OnInit {
  private authService = inject(AuthService);
  private modulesService = inject(ModulesService);
  private orgContext = inject(OrgContextService);

  modules = signal<StyModule[]>([]);

  constructor() { }

  ngOnInit() {
    this.loadModules();
  }

  loadModules() {

    this.modulesService.getModules().subscribe({
      next: (data: StyModule[]) => {
        console.log(data);
        this.modules.set(data);
        console.log(this.modules(), "modulessss")

      },
      error: (err: any) => {
        console.error('Failed to load modules:', err);

      }
    });
  }



  /**
   * Navigate to module detail or open module
   */
  openModule(module: any) {
    console.log('Opening module:', module);

    // Set selected module ID in AuthService
    if (module.moduleID) {
      this.authService.setSelectedModule(module.moduleID);
      this.authService.setSelectedModuleName(module.moduleName);
    }

    // Use common navigation helper to automatically handle /app/:orgId prefix
    this.orgContext.navigateTo([module.moduleName.toLowerCase()]);
  }
}
