import { Component, DOCUMENT, Inject, Renderer2, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

/**
 * Header Component
 * 
 * Top navigation bar with:
 * - Logo and branding
 * - Navigation links
 * - User profile dropdown
 * - Logout functionality
 */
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/api-services/auth/auth.service';
import { OrgContextService } from '../../core/services/org-context.service';
import { UserResponse } from '../../core/modals/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIcon, MatMenuModule, MatButtonModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {


  User: UserResponse | null;


  ChangePassword() {
    throw new Error('Method not implemented.');
  }
  ModulesChange() {
    this.orgNavigate.navigateTo(['modules'])
    // this.router.navigate(['/app/modules']);
    this.isUserMenuOpen = false;
  }
  isUserMenuOpen = false;
  currentUser = {
    name: 'Admin User',
    email: 'admin@bizarabia.com',
    role: 'Administrator'
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private orgNavigate: OrgContextService,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {

    this.User = this.authService.currentUser()

    console.log(this.User, "currentUSer")

  }



  isDarkMode = false;
  // isCompact = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isUserMenuOpen && !this.el.nativeElement.querySelector('.profile-container').contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }




  // toggleCompactMode() {
  //   this.isCompact = !this.isCompact;
  //   if (this.isCompact) {
  //     // Adds .compact-mode to <body> to trigger --unit-size: 0.8rem
  //     this.renderer.addClass(this.document.body, 'compact-mode');
  //   } else {
  //     this.renderer.removeClass(this.document.body, 'compact-mode');
  //   }
  // }



  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const themeValue = this.isDarkMode ? 'dark' : 'light';

    // This targets the [data-theme] selector in your CSS
    this.renderer.setAttribute(this.document.documentElement, 'data-theme', themeValue);
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  get greetingName(): string {
    return this.User?.employeeName ? this.User.employeeName.split(' ')[0] : 'User';
  }

  logout() {
    this.isUserMenuOpen = false;
    this.authService.logout();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.isUserMenuOpen = false;
  }
}
