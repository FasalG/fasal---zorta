import { Component } from '@angular/core';
import { ActionButtonComponent } from "../../../shared/components/action-button/action-button.component";
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/data-table/data-table.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    ActionButtonComponent,
    DropdownComponent,
    InputComponent,
    TextareaComponent,
    DatePickerComponent,
    DataTableComponent,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    ActionButtonComponent
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent {
  // 1. Initialize the FormGroup
  companyForm = new FormGroup({
    department: new FormControl('', [Validators.required, Validators.email]),
    syllabus: new FormControl(null, [Validators.required]),
    sanctionedDate: new FormControl(null)
  });

  // 3. Sample Data for DataTable
  companyColumns: DataTableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'Company Name', sortable: true, filterable: true },
    { key: 'code', label: 'Company Code', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'phone', label: 'Phone', sortable: false }
  ];

  companyData = [
    { id: 1, name: 'BizArabia IT Solutions', code: 'BA001', email: 'it@bizarabia.com', phone: '123-456-7890' },
    { id: 2, name: 'Global ERP Systems', code: 'GE002', email: 'support@globalerp.com', phone: '098-765-4321' },
    { id: 3, name: 'Tech Pioneers', code: 'TP003', email: 'hello@techpioneers.com', phone: '555-012-3456' },
    { id: 4, name: 'Creative Consultants', code: 'CC004', email: 'info@creative.com', phone: '444-987-6543' },
    { id: 5, name: 'Secure Networks', code: 'SN005', email: 'admin@securenet.com', phone: '333-111-2222' },
    { id: 6, name: 'BizArabia IT Solutions', code: 'BA001', email: 'it@bizarabia.com', phone: '123-456-7890' },
    { id: 7, name: 'Global ERP Systems', code: 'GE002', email: 'support@globalerp.com', phone: '098-765-4321' },
    { id: 8, name: 'Tech Pioneers', code: 'TP003', email: 'hello@techpioneers.com', phone: '555-012-3456' },
    { id: 9, name: 'Creative Consultants', code: 'CC004', email: 'info@creative.com', phone: '444-987-6543' },
    { id: 10, name: 'Secure Networks', code: 'SN005', email: 'admin@securenet.com', phone: '333-111-2222' }
  ];

  // 2. Method to access the data
  onSubmit() {
    if (this.companyForm.valid) {
      console.log('Form Data:', this.companyForm.value);
      // Access specific value
      const selectedSyllabus = this.companyForm.get('syllabus')?.value;
      console.log('Selected Syllabus Code:', selectedSyllabus);
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  onEdit(company: any) {
    console.log('Editing company:', company);
  }

  onDelete(company: any) {
    console.log('Deleting company:', company);
  }

  onCLick(e: MouseEvent) {
    console.log('click', e);
  }
}
