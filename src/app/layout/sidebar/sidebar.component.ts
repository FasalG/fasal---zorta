import { Component, HostListener, inject, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/api-services/auth/auth.service';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { OrgContextService } from '../../core/services/org-context.service';

interface UserRightsMenuDTO {
  securityID: number;
  parentID: number | null;
  pageName: string;
  link: string;
  linkImage: string | null;
}

interface MenuItem {
  id?: number;
  icon?: string;
  label: string;
  path?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

/**
 * Sidebar Component
 * 
 * Left navigation with:
 * - Menu items with icons
 * - Nested submenu support
 * - Collapsible functionality
 * - Active route highlighting
 * - Responsive toggle
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private sidebarState = inject(SidebarStateService);
  private authService = inject(AuthService);
  private router = inject(Router); // Inject Router here
  private orgContext = inject(OrgContextService);
  isCollapsed = this.sidebarState.isCollapsed;
  isOpen = true; // For mobile

  menuItems = signal<MenuItem[]>([]);
  searchText = signal<string>('');

  // Computed signal for filtered menu items
  filteredMenuItems = computed(() => {
    const query = this.searchText().toLowerCase().trim();
    if (!query) return this.menuItems();

    return this.menuItems().filter(item => {
      const labelMatches = item.label.toLowerCase().includes(query);
      const childMatches = item.children?.some(child =>
        child.label.toLowerCase().includes(query)
      );
      return labelMatches || childMatches;
    }).map(item => {
      // If children match, we might want to filter the children too
      if (item.children) {
        const filteredChildren = item.children.filter(child =>
          child.label.toLowerCase().includes(query) || item.label.toLowerCase().includes(query)
        );
        return { ...item, children: filteredChildren, isExpanded: true };
      }
      return item;
    });
  });

  private closeTimeout: any;

  constructor() {
    // Reactively fetch side menu when technical module ID changes
    effect(() => {
      const moduleId = this.authService.selectedModuleId();
      console.log(`[Sidebar] Detected ModuleID change: ${moduleId}. Fetching menu...`);

      this.authService.GetSideMenu().subscribe({
        next: (res) => {
          console.log(`[Sidebar] Menu data received for ModuleID ${moduleId}:`, res);
          if (res && Array.isArray(res)) {
            const transformed = this.transformMenuData(res);
            this.menuItems.set(transformed);
          } else {
            console.warn(`[Sidebar] No menu data or invalid format received for ModuleID ${moduleId}`);
            this.menuItems.set([]);
          }
        },
        error: (err) => {
          console.error(`[Sidebar] Failed to fetch menu for ModuleID ${moduleId}:`, err);
        }
      });
    });
  }

  private transformMenuData(data: UserRightsMenuDTO[]): MenuItem[] {
    const menus: MenuItem[] = [];

    // ParentID null means it's a root/main menu item
    const rootItems = data.filter(item => item.parentID === null);

    rootItems.forEach(root => {
      const children = data
        .filter(child => child.parentID === root.securityID)
        .map(child => ({
          id: child.securityID,
          label: child.pageName,
          icon: child.linkImage || this.getDefaultIcon(child.pageName),
          path: child.link && child.link !== "" ? child.link : undefined
        }));

      menus.push({
        id: root.securityID,
        label: root.pageName,
        icon: root.linkImage || this.getDefaultIcon(root.pageName),
        path: root.link && root.link !== "" ? root.link : undefined,
        children: children.length > 0 ? children : undefined
      });
    });

    return menus;
  }

  private getDefaultIcon(label: string): string {
    const l = label.toLowerCase();
    if (l.includes('dashboard')) return 'dashboard';
    if (l.includes('master')) return 'settings';
    if (l.includes('transaction')) return 'receipt_long';
    if (l.includes('report')) return 'assessment';
    if (l.includes('setting')) return 'settings';
    if (l.includes('accounts')) return 'account_balance_wallet';
    if (l.includes('company')) return 'business';
    if (l.includes('voucher')) return 'confirmation_number';
    if (l.includes('cash')) return 'payments';
    if (l.includes('bank')) return 'account_balance';
    if (l.includes('cheque')) return 'payments';
    return 'circle'; // Default indicator
  }

  toggleSubmenu(item: MenuItem) {
    if (item.children && item.children.length > 0) {
      const wasExpanded = !!item.isExpanded;
      this.menuItems.update(items => items.map(i => {
        if (i.id === item.id) {
          return { ...i, isExpanded: !wasExpanded };
        }
        // Optional: close other submenus
        return { ...i, isExpanded: false };
      }));
    }
  }

  private enterTimeout: any;
  private leaveTimeout: any;

  hoverOnSide(e: MouseEvent, item: MenuItem) {
    if (!this.isCollapsed() || !item.children || item.children.length === 0) return;

    e.stopPropagation();

    // Clear previous hovers
    clearTimeout(this.enterTimeout);
    clearTimeout(this.leaveTimeout);
    document.querySelector('.hover-element')?.remove();

    const hElement = document.createElement('div');
    hElement.classList.add('hover-element');
    hElement.style.position = 'absolute';
    hElement.style.zIndex = '10000';
    hElement.style.backgroundColor = 'var(--bg-surface)';
    hElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
    hElement.style.borderRadius = '12px';
    hElement.style.padding = '8px';
    hElement.style.minWidth = '200px';
    hElement.style.border = '1px solid var(--border-color)';

    // Add header
    const header = document.createElement('div');
    header.style.padding = '8px 12px';
    header.style.fontSize = '11px';
    header.style.fontWeight = '700';
    header.style.color = 'var(--text-light)';
    header.style.textTransform = 'uppercase';
    header.style.letterSpacing = '0.8px';
    header.style.borderBottom = '1px solid var(--border-color-light)';
    header.style.marginBottom = '4px';
    header.textContent = item.label;
    hElement.appendChild(header);

    // Add scrollable container for submenu links
    const scrollContainer = document.createElement('div');
    scrollContainer.style.maxHeight = '300px';
    scrollContainer.style.overflowY = 'auto';
    scrollContainer.style.paddingRight = '4px'; // Space for scrollbar
    hElement.appendChild(scrollContainer);

    // Add submenu links
    item.children.forEach((sub: MenuItem) => {
      const a = document.createElement('button');
      a.classList.add('submenu-item');
      a.setAttribute('style', `
        width: 100%;
        text-align: left;
        padding: 8px 12px;
        margin-bottom: 2px;
        text-decoration: none;
        font-size: 13px;
        color: var(--text-main);
        display: block;
        border: none;
        background: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      `);

      if (this.isActive(sub.path)) {
        a.style.backgroundColor = 'var(--primary-light)';
        a.style.color = 'var(--primary)';
        a.style.fontWeight = '600';
      } else {
        a.onmouseover = () => {
          a.style.backgroundColor = 'var(--bg-surface-hover)';
          a.style.color = 'var(--primary)';
        };
        a.onmouseleave = () => {
          a.style.backgroundColor = 'transparent';
          a.style.color = 'var(--text-main)';
        };
      }

      a.textContent = sub.label;
      a.addEventListener('click', () => {
        this.handleSubmenuClick(sub, item.label);
        document.querySelector('.hover-element')?.remove();
      });
      scrollContainer.appendChild(a);
    });

    // Position next to the hovered element
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const popupHeight = item.children.length * 40 + 40; // Approx calculation
    const windowHeight = window.innerHeight;

    // Adjust top position if it would go off-screen
    let top = rect.top;
    if (top + popupHeight > windowHeight) {
      top = Math.max(10, windowHeight - popupHeight - 20);
    }

    hElement.style.top = `${top}px`;
    hElement.style.left = `${rect.right + 10}px`;

    document.body.appendChild(hElement);

    // Hover persistence
    hElement.onmouseover = () => {
      clearTimeout(this.leaveTimeout);
    };
    hElement.onmouseleave = () => {
      this.leaveOnSide();
    };
  }

  leaveOnSide() {
    clearTimeout(this.leaveTimeout);
    this.leaveTimeout = setTimeout(() => {
      document.querySelector('.hover-element')?.remove();
    }, 200);
  }

  handleMenuClick(item: MenuItem) {
    // if (item.label !== 'Dashboard') {
    //   localStorage.setItem('GroupName', item.label);
    // } else {
    //   localStorage.removeItem('GroupName');
    // }

    // if (item.path) {
    //   localStorage.removeItem('PrivilegeName');
    //   this.navigateTo(item.path);
    // }
  }

  handleSubmenuClick(subitem: MenuItem, parentLabel: string) {
    if (parentLabel !== 'Dashboard') {
      localStorage.setItem('GroupName', parentLabel);
      localStorage.setItem('PrivilegeName', subitem.label);
    } else {
      localStorage.removeItem('GroupName');
      localStorage.removeItem('PrivilegeName');
    }

    const modulename = this.authService.selectedModuleName().toLowerCase();

    // if (subitem.path) {
    this.navigateTo([modulename, 'company']);
    // }
  }

  @HostListener('document:click')
  onDocumentClick() {
    document.querySelector('.hover-element')?.remove();
  }

  toggleSidebar() {
    document.querySelector('.hover-element')?.remove();
    this.sidebarState.toggle();
  }

  toggleMobileSidebar() {
    this.sidebarState.toggle();
  }

  navigateTo(path?: string[]) {
    if (path) {
      this.orgContext.navigateTo(path);
      if (window.innerWidth < 768) {
        this.isOpen = false;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 768) {
      this.isOpen = true;
    }
  }

  isActive(path?: string): boolean {
    if (!path) return false;
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
}
