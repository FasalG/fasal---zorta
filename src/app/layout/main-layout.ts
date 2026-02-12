import { Component, inject } from '@angular/core';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet, Params } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarStateService } from '../core/services/sidebar-state.service';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { OrgContextService } from '../core/services/org-context.service';

/**
 * Main Layout Component
 * 
 * Application shell with:
 * - Header (top navigation)
 * - Sidebar (left navigation)
 * - Router outlet (main content area)
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, BreadcrumbComponent, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private orgContext = inject(OrgContextService);
  sidebarState = inject(SidebarStateService);

  constructor() {
    // 1. Capture and Set Org ID Context
    // We listen to param changes because the layout stays the same when switching orgs
    this.route.params.subscribe((params: Params) => {
      const orgId = params['orgId'];

      this.orgContext.setOrgId(orgId);
    });

    // 2. Detect route changes to hide sidebar on /app/:orgId/modules
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateSidebarVisibility(event.urlAfterRedirects || event.url);
    });

    // 3. Initial Check
    this.updateSidebarVisibility(this.router.url);
  }

  private updateSidebarVisibility(url: string) {
    // 1. Strip query parameters and fragments for matching
    const urlPath = url.split(/[?#]/)[0];

    // 2. Normalize by removing trailing slash
    const cleanPath = urlPath.replace(/\/$/, '');

    // 3. Check if we are on the modules root page: /app/:orgId/modules
    const segments = cleanPath.split('/').filter(s => s !== '');
    const isModulesPage = segments.length === 3 && segments[0] === 'app' && segments[2] === 'modules';

    console.log(`[MainLayout] Navigation: URL=${url}, isModulesPage=${isModulesPage}`);

    this.sidebarState.isHidden.set(isModulesPage);
    console.log(`[MainLayout] Sidebar visibility - isHidden: ${isModulesPage}`);
  }
}
