import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'shared-action-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent {
  @Input() variant: 'edit' | 'save' | 'delete' | 'cancel' | 'primary' | 'secondary' | 'custom' = 'primary';
  @Input() label?: string;
  @Input() icon?: string;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() color: 'primary' | 'accent' | 'warn' | 'inherit' = 'primary';
  @Output() pressed = new EventEmitter<MouseEvent>();

  onClick(e: MouseEvent) {
    if (this.loading || this.disabled) {
      e.preventDefault();
      return;
    }
    this.pressed.emit(e);
  }

  get computedColor(): string {
    if (this.variant === 'delete') return 'warn';
    if (this.variant === 'secondary') return 'accent';
    if (this.variant === 'edit') return 'primary';
    return this.color;
  }
}
