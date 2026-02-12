import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewEncapsulation, forwardRef, inject, Injector, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl, AbstractControl, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPseudoCheckboxModule, MatPseudoCheckboxState } from '@angular/material/core';

@Component({
    selector: 'shared-dropdown',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        MatPseudoCheckboxModule
    ],
    encapsulation: ViewEncapsulation.None,
    template: `
        <mat-form-field appearance="outline" class="shared-field w-100">
            <mat-label *ngIf="label">{{ label }}</mat-label>
            <mat-select
                [formControl]="internalControl"
                [multiple]="multiple"
                [disabled]="disabled"
                (selectionChange)="onSelect($event.value)"
            >
                <div class="search-container" *ngIf="list && list.length > 5">
                    <mat-icon>search</mat-icon>
                    <input 
                        matInput 
                        class="search-input"
                        (input)="filter($event)" 
                        [placeholder]="placeholder" 
                        (click)="$event.stopPropagation()"
                        (keydown)="$event.stopPropagation()"
                    />
                </div>

                <mat-option *ngIf="enableSelectAll && multiple" (click)="toggleSelectAll($event)" class="select-all-option">
                    <mat-pseudo-checkbox [state]="selectAllState"></mat-pseudo-checkbox>
                    Select All
                </mat-option>

                <mat-option *ngFor="let item of filteredList" [value]="item[valueField]">
                    {{ item[displayField] }}
                </mat-option>

                <div class="no-results" *ngIf="filteredList.length === 0">
                    No items found
                </div>
            </mat-select>
            <mat-error *ngIf="showError">{{ getError() }}</mat-error>
        </mat-form-field>
    `,
    styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnChanges, ControlValueAccessor, DoCheck, OnInit {
    @Input() label!: string;
    @Input() placeholder: string = 'Search...';
    @Input() list: any[] = [];
    @Input() valueField!: string;
    @Input() displayField!: string;
    @Input() disabled: boolean = false;
    @Input() showAll: boolean = false;
    @Input() allLabel: string = 'All';
    @Input() allValue: any = '%';
    @Input() multiple: boolean = true;
    @Input() enableSelectAll: boolean = true;
    @Input() errorMessage?: string | ((errors: any) => string);

    @Output() selectionChange = new EventEmitter<any>();

    internalControl = new FormControl();
    filteredList: any[] = [];
    selectAllState: MatPseudoCheckboxState = 'unchecked';
    searchKeyword: string = '';

    private _ngControl = inject(NgControl, { optional: true, self: true });

    constructor() {
        if (this._ngControl) {
            this._ngControl.valueAccessor = this;
        }
    }

    ngOnInit(): void {
        if (this._ngControl) {
            this.internalControl.setValidators(this._ngControl.control?.validator || null);
            this.internalControl.updateValueAndValidity();
        }
    }

    ngOnChanges() {
        this.updateFilteredList();
    }

    ngDoCheck() {
        if (this._ngControl?.control) {
            this.updateSelectAllState();
        }
    }

    // --- ControlValueAccessor Implementation ---
    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.internalControl.setValue(value, { emitEvent: false });
        this.updateSelectAllState();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        isDisabled ? this.internalControl.disable() : this.internalControl.enable();
    }

    // --- Logic ---

    updateFilteredList() {
        let baseList = this.list ? [...this.list] : [];

        if (this.searchKeyword) {
            const keyword = this.searchKeyword.toLowerCase();
            baseList = baseList.filter(item =>
                item[this.displayField]?.toString().toLowerCase().includes(keyword)
            );
        }

        if (this.showAll && baseList.length > 0 && !this.searchKeyword) {
            baseList.unshift({
                [this.valueField]: this.allValue,
                [this.displayField]: this.allLabel
            });
        }

        this.filteredList = baseList;
    }

    filter(event: any) {
        this.searchKeyword = event.target.value;
        this.updateFilteredList();
    }

    onSelect(value: any) {
        this.onChange(value);
        this.selectionChange.emit(value);
        this.updateSelectAllState();
    }

    toggleSelectAll(event: any) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        const currentValues = Array.isArray(this.internalControl.value) ? [...this.internalControl.value] : [];
        const visibleValues = this.filteredList
            .filter(item => item[this.valueField] !== this.allValue)
            .map(item => item[this.valueField]);

        let newValues: any[];

        if (this.selectAllState === 'checked') {
            // Unselect all visible: Remove visible values from the current selection
            newValues = currentValues.filter(v => !visibleValues.includes(v));
        } else {
            // Select all visible: Add all visible values to current selection, avoiding duplicates
            const otherValues = currentValues.filter(v => !visibleValues.includes(v));
            newValues = [...otherValues, ...visibleValues];
        }

        this.internalControl.setValue(newValues);
        this.onChange(newValues);
        this.selectionChange.emit(newValues);
        this.updateSelectAllState();
    }

    updateSelectAllState() {
        const val = this.internalControl.value;
        const currentSelection = Array.isArray(val) ? val : [];

        const visibleItems = this.filteredList.filter(item => item[this.valueField] !== this.allValue);
        const totalVisible = visibleItems.length;

        if (totalVisible === 0) {
            this.selectAllState = 'unchecked';
            return;
        }

        const selectedVisible = visibleItems.filter(item =>
            currentSelection.includes(item[this.valueField])
        ).length;

        if (selectedVisible === 0) {
            this.selectAllState = 'unchecked';
        } else if (selectedVisible === totalVisible) {
            this.selectAllState = 'checked';
        } else {
            this.selectAllState = 'indeterminate';
        }
    }

    // --- Validation ---

    get control(): AbstractControl | null {
        return this._ngControl?.control || null;
    }

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
            case 'required': return 'Required';
            case 'minlength': return `Minimum length ${val?.requiredLength}`;
            case 'maxlength': return `Maximum length ${val?.requiredLength}`;
            case 'email': return 'Invalid email';
            default: return firstKey;
        }
    }
}
