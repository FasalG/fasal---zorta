import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  isCollapsed = signal(false);
  isHidden = signal(false);

  toggle() {
    this.isCollapsed.update(v => !v);
  }
}
