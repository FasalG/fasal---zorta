import { Component, Input, inject, Injector, forwardRef, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'shared-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
    encapsulation: ViewEncapsulation.None,
    template: `
    <mat-form-field appearance="outline" class="shared-field">
      <mat-label *ngIf="label">{{ label }}</mat-label>
      <input
        matInput
        [formControl]="control"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
      />
      <mat-icon matPrefix *ngIf="prefixIcon">{{ prefixIcon }}</mat-icon>
      <mat-icon matSuffix *ngIf="suffixIcon">{{ suffixIcon }}</mat-icon>
      <mat-error *ngIf="control.invalid && (control.touched || control.dirty)">
        {{ getErrorMessage() }}
      </mat-error>
    </mat-form-field>
  `
})
export class InputComponent implements ControlValueAccessor, OnInit {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() prefixIcon?: string;
    @Input() suffixIcon?: string;
    @Input() disabled: boolean = false;

    control = new FormControl();
    private ngControl = inject(NgControl, { optional: true, self: true });

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit(): void {
        if (this.ngControl) {
            this.control.setValidators(this.ngControl.control?.validator || null);
            this.control.updateValueAndValidity();
        }
    }

    // ControlValueAccessor
    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.control.setValue(value, { emitEvent: false });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
        this.control.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        isDisabled ? this.control.disable() : this.control.enable();
    }

    getErrorMessage(): string {
        if (this.control.hasError('required')) return 'Required';
        if (this.control.hasError('email')) return 'Invalid email';
        return 'Invalid field';
    }
}
