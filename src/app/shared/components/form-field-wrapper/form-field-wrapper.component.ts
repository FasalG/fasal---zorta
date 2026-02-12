import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'shared-form-field',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './form-field-wrapper.component.html',
  styleUrls: ['./form-field-wrapper.component.scss']
})
export class FormFieldWrapperComponent {
  @Input() label?: string;
  @Input() control?: AbstractControl | null;
//   @Input() appearance= 'outline';
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() errorMessage?: string | ((errors: any) => string);

  get showError(): boolean {
    return !!(this.control && this.control.invalid && (this.control.touched || this.control.dirty));
  }

  getError(): string | null {
    if (!this.control || !this.control.errors) return null;
    if (typeof this.errorMessage === 'string') return this.errorMessage;
    if (typeof this.errorMessage === 'function') return this.errorMessage(this.control.errors);
    const firstKey = Object.keys(this.control.errors)[0];
    const val = this.control.errors[firstKey];
    switch (firstKey) {
      case 'required':
        return 'Required';
      case 'minlength':
        return `Minimum length ${val?.requiredLength}`;
      case 'maxlength':
        return `Maximum length ${val?.requiredLength}`;
      case 'email':
        return 'Invalid email';
      default:
        return firstKey;
    }
  }
}
