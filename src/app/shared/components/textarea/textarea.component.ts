import { Component, Input, inject, Injector, forwardRef, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
    selector: 'shared-textarea',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TextFieldModule],
    encapsulation: ViewEncapsulation.None,
    template: `
    <mat-form-field appearance="outline" class="shared-field">
      <mat-label *ngIf="label">{{ label }}</mat-label>
      <textarea
        matInput
        cdkTextareaAutosize
        #autosize="cdkTextareaAutosize"
        [cdkAutosizeMinRows]="rows"
        [cdkAutosizeMaxRows]="maxRows"
        [formControl]="control"
        [placeholder]="placeholder"
        [disabled]="disabled"
      ></textarea>
      <mat-error *ngIf="control.invalid && (control.touched || control.dirty)">
        {{ getErrorMessage() }}
      </mat-error>
    </mat-form-field>
  `,
    styles: [`
    .mat-form-field-type-mat-textarea .mat-mdc-text-field-wrapper {
      padding: 8px 12px !important;
      height: auto !important;
    }
    textarea.mat-mdc-input-element {
    //   padding: 0 !important;
    //   margin: 0 !important;
    //   resize: none;
    }
  `]
})
export class TextareaComponent implements ControlValueAccessor, OnInit {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() rows: number = 1;
    @Input() maxRows: number = 10;
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
        return 'Invalid field';
    }
}
