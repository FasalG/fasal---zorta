import { Component, Input, inject, Injector, forwardRef, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'shared-date-picker',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        provideNativeDateAdapter()
    ],
    template: `
    <mat-form-field appearance="outline" class="shared-field">
      <mat-label *ngIf="label">{{ label }}</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        [formControl]="control"
        [placeholder]="placeholder"
        [disabled]="disabled"
      />
      <mat-datepicker-toggle matSuffix [for]="picker">
        <mat-icon matDatepickerToggleIcon>calendar_today</mat-icon>
      </mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      <mat-error *ngIf="control.invalid && (control.touched || control.dirty)">
        {{ getErrorMessage() }}
      </mat-error>
    </mat-form-field>
  `,
    styles: [`
    mat-datepicker-content {
      background: white !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 12px !important;
      overflow: hidden !important;
    }
  `]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
    @Input() label: string = '';
    @Input() placeholder: string = '';
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
        return 'Invalid date';
    }
}
