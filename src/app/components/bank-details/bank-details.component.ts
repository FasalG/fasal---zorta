import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDetailService } from '../../services/bank-detail.service';
import { BankDetail } from '../../models/rental.models';

@Component({
    selector: 'app-bank-details',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container-fluid py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="h3 fw-bold text-dark mb-0">Bank Details</h2>
          <p class="text-secondary mb-0">Manage bank accounts for receiving payments</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" (click)="showForm = true; resetForm()">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Bank Account
        </button>
      </div>

      <div class="row g-4">
        <!-- Bank Accounts List -->
        <div class="col-12 col-lg-8" [class.col-lg-12]="!showForm">
          <div class="row g-3">
            <div class="col-12 col-md-6" *ngFor="let bank of bankDetails()">
              <div class="card shadow-sm border-0 h-100 p-4">
                <div class="d-flex justify-content-between mb-3">
                  <div class="badge bg-primary-subtle text-primary border border-primary px-3 py-2" *ngIf="bank.is_default">Default</div>
                  <div class="ms-auto d-flex gap-2">
                    <button class="btn btn-sm btn-link text-primary p-0" (click)="editBank(bank)">Edit</button>
                    <button class="btn btn-sm btn-link text-danger p-0" (click)="deleteBank(bank)">Delete</button>
                  </div>
                </div>
                <h5 class="fw-bold mb-1">{{ bank.bank_name }}</h5>
                <p class="text-secondary small mb-3">{{ bank.account_holder }}</p>
                
                <div class="bg-light rounded p-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-secondary small">Account Number</span>
                    <span class="fw-medium">{{ bank.account_number }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="text-secondary small">IFSC Code</span>
                    <span class="fw-medium text-uppercase">{{ bank.ifsc_code }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-12 text-center py-5" *ngIf="bankDetails().length === 0">
              <div class="text-secondary mb-3">No bank accounts added yet</div>
              <button class="btn btn-outline-primary px-4" (click)="showForm = true; resetForm()">Add First Account</button>
            </div>
          </div>
        </div>

        <!-- Add/Edit Form -->
        <div class="col-12 col-lg-4" *ngIf="showForm">
          <div class="card shadow-sm border-0 p-4 sticky-top" style="top: 2rem;">
            <div class="d-flex align-items-center justify-content-between mb-4">
              <h5 class="fw-bold mb-0">{{ isEditing ? 'Edit Account' : 'New Bank Account' }}</h5>
              <button type="button" class="btn-close" (click)="showForm = false"></button>
            </div>

            <form #bankForm="ngForm" (ngSubmit)="saveBank()">
              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">Account Holder Name</label>
                <input type="text" class="form-control" name="account_holder" [(ngModel)]="currentBank.account_holder" required placeholder="e.g. John Doe">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">Bank Name</label>
                <input type="text" class="form-control" name="bank_name" [(ngModel)]="currentBank.bank_name" required placeholder="e.g. HDFC Bank">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">Account Number</label>
                <input type="text" class="form-control" name="account_number" [(ngModel)]="currentBank.account_number" required placeholder="0000 0000 0000">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">IFSC Code</label>
                <input type="text" class="form-control" name="ifsc_code" [(ngModel)]="currentBank.ifsc_code" required placeholder="HDFC0000123" style="text-transform: uppercase;">
              </div>
              <div class="mb-4">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" name="is_default" [(ngModel)]="currentBank.is_default" id="flexSwitchCheckDefault">
                  <label class="form-check-label small" for="flexSwitchCheckDefault">Set as default for bookings</label>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary py-2 fw-bold" [disabled]="!bankForm.valid">
                  {{ isEditing ? 'Update Account' : 'Save Bank Account' }}
                </button>
                <button type="button" class="btn btn-light py-2" (click)="showForm = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .bg-light { background-color: #f8f9fa !important; }
    .sticky-top { z-index: 10; }
  `]
})
export class BankDetailsComponent implements OnInit {
    private bankService = inject(BankDetailService);

    bankDetails = signal<BankDetail[]>([]);
    showForm = false;
    isEditing = false;
    currentBank: Partial<BankDetail> = {};

    ngOnInit() {
        this.loadBankDetails();
    }

    loadBankDetails() {
        this.bankService.getAll().subscribe(data => this.bankDetails.set(data));
    }

    resetForm() {
        this.isEditing = false;
        this.currentBank = {
            account_holder: '',
            bank_name: '',
            account_number: '',
            ifsc_code: '',
            is_default: this.bankDetails().length === 0
        };
    }

    editBank(bank: BankDetail) {
        this.isEditing = true;
        this.showForm = true;
        this.currentBank = { ...bank };
    }

    saveBank() {
        if (this.isEditing) {
            this.bankService.update(this.currentBank as BankDetail).subscribe(() => {
                this.loadBankDetails();
                this.showForm = false;
            });
        } else {
            this.bankService.add(this.currentBank as BankDetail).subscribe(() => {
                this.loadBankDetails();
                this.showForm = false;
            });
        }
    }

    deleteBank(bank: BankDetail) {
        if (confirm('Are you sure you want to delete this bank account?')) {
            this.bankService.delete((bank._id || bank.id)!).subscribe(() => {
                this.loadBankDetails();
            });
        }
    }
}
