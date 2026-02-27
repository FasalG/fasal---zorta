import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Booking, Customer, RentalItem, BankDetail } from '../../../../models/rental.models';
import { BankDetailService } from '../../../../services/bank-detail.service';

@Component({
  selector: 'app-booking-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="dialog-header d-flex align-items-center justify-content-between p-2 p-md-4 pb-1 pb-md-2">
      <h2 class="h5 fw-bold mb-0">{{ data.isEditing ? 'Edit Booking' : 'Create New Booking' }}</h2>
      <button mat-icon-button (click)="onCancel()" class="text-secondary">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <mat-dialog-content class="px-2 px-md-4 py-2 custom-scrollbar">
      <form #bookingForm="ngForm" class="row g-2 g-md-4">
        <!-- Customer & Item -->
        <div class="col-12">
          <label class="form-label small fw-bold text-secondary mb-1">Customer Selection</label>
          <mat-form-field appearance="outline" class="w-100">
            <mat-select name="customer" [(ngModel)]="currentBooking.customer" required placeholder="Select a customer">
              <mat-option *ngFor="let cus of data.customers" [value]="cus._id || cus.id">
                <div class="d-flex flex-column">
                  <span class="fw-medium">{{ cus.name }}</span>
                  <span class="smaller text-secondary">{{ cus.email }}</span>
                </div>
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="col-12">
          <label class="form-label small fw-bold text-secondary mb-1">Equipment / Items (Multi-select)</label>
          <mat-form-field appearance="outline" class="w-100">
            <mat-select name="items" [ngModel]="selectedItemIds" (ngModelChange)="onItemsChange($event)" required multiple placeholder="Select items for booking">
              <mat-option *ngFor="let item of data.items" [value]="item._id || item.id">
                <div class="d-flex justify-content-between w-100 align-items-center">
                  <span>{{ item.name }}</span>
                  <span class="badge bg-light text-dark smaller">{{ item.available_quantity }} available</span>
                </div>
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Dates -->
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold text-secondary mb-1">Start Date</label>
          <mat-form-field appearance="outline" class="w-100" (click)="startPicker.open()">
            <input matInput [matDatepicker]="startPicker" name="start_date" [(ngModel)]="currentBooking.start_date" required (ngModelChange)="calculateAmount(); detectInitialStatus();" placeholder="Choose a date">
            <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker yPosition="below" panelClass="bg-white-datepicker"></mat-datepicker>
          </mat-form-field>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold text-secondary mb-1">End Date</label>
          <mat-form-field appearance="outline" class="w-100" (click)="endPicker.open()">
            <input matInput [matDatepicker]="endPicker" name="end_date" [(ngModel)]="currentBooking.end_date" required  placeholder="Choose a date">
            <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker yPosition="below" panelClass="bg-white-datepicker"></mat-datepicker>
          </mat-form-field>
        </div>

        <!-- Payment Details -->
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold text-secondary mb-1">Payment Method</label>
          <mat-form-field appearance="outline" class="w-100">
            <mat-select name="payment_method" [(ngModel)]="currentBooking.payment_method" required>
              <mat-option value="none">None / Later</mat-option>
              <mat-option value="cash">Cash Payment</mat-option>
              <mat-option value="bank">Bank Transfer</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="col-12 col-md-6" *ngIf="currentBooking.payment_method === 'bank'">
          <label class="form-label small fw-bold text-secondary mb-1">Bank Account</label>
          <mat-form-field appearance="outline" class="w-100">
            <mat-select name="bank_detail" [(ngModel)]="currentBooking.bank_detail">
              <mat-option *ngFor="let bank of bankDetails()" [value]="bank._id || bank.id">
                {{ bank.bank_name }} ({{ bank.account_number }})
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold text-secondary mb-1">Initial Payment Received</label>
          <mat-form-field appearance="outline" class="w-100">
            <span matPrefix class="text-secondary pe-1">₹</span>
            <input matInput type="number" name="initial_payment_received" [(ngModel)]="currentBooking.initial_payment_received">
          </mat-form-field>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold text-secondary mb-1">Total Fee (Calculated)</label>
          <mat-form-field appearance="outline" class="w-100">
            <span matPrefix class="text-secondary pe-1">₹</span>
            <input matInput type="number" name="amount" [(ngModel)]="currentBooking.amount" required>
            <span matSuffix class="text-secondary small pe-2">{{ currentBooking.duration_days }} Days</span>
          </mat-form-field>
        </div>

        <div class="col-12">
          <label class="form-label small fw-bold text-secondary mb-1">Reservation Status</label>
          <mat-form-field appearance="outline" class="w-100">
            <mat-select name="status" [(ngModel)]="currentBooking.status" required>
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="active">Active (Rented Out)</mat-option>
              <mat-option value="cancelled">Cancelled</mat-option>
              <mat-option value="closed">Closed (Returned)</mat-option>
            </mat-select>
          </mat-form-field>
          <p class="smaller text-muted mt-n2">Tip: Manual status overrides are supported. 'Active' implies the item is currently with the customer.</p>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="px-2 px-md-4 py-2 py-md-3 d-flex flex-wrap justify-content-end gap-2 border-top dialog-actions-mobile">
      <button class="btn btn-light px-4 fw-semibold flex-grow-1 flex-md-grow-0" (click)="onCancel()">Discard</button>
      <button class="btn btn-primary px-4 fw-semibold shadow-sm flex-grow-1 flex-md-grow-0" [disabled]="!bookingForm.valid" (click)="onSave()">
        {{ data.isEditing ? 'Update Reservation' : 'Confirm & Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      width: 750px;
      max-width: 95vw;
      max-height: 90vh;
    }
    mat-dialog-content {
      flex: 1 1 auto;
      overflow-y: auto;
    }
    .smaller { font-size: 0.75rem; }
    
    ::ng-deep .bg-white-datepicker {
      background-color: #ffffff !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    }
    ::ng-deep .bg-white-datepicker .mat-calendar {
      background-color: #ffffff !important;
      border-radius: 8px !important;
    }
    ::ng-deep .mat-datepicker-content, ::ng-deep .mat-calendar-content {
      background-color: #ffffff !important;
    }

    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      padding: 0 !important;
    }
    @media (max-width: 768px) {
      .dialog-header h2 {
        font-size: 1.15rem;
      }
      mat-dialog-content {
        max-height: calc(95vh - 120px) !important;
        padding: 12px 10px !important;
      }
      .dialog-actions-mobile {
        flex-direction: column-reverse;
        padding: 12px 10px !important;
      }
      .dialog-actions-mobile button {
        width: 100%;
        margin: 0 !important;
      }
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #bdbdbd;
    }
  `]
})
export class BookingFormDialogComponent implements OnInit {
  public data = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<BookingFormDialogComponent>);
  private bankService = inject(BankDetailService);

  currentBooking: Partial<Booking>;
  selectedItemIds: string[] = [];
  bankDetails = signal<BankDetail[]>([]);

  constructor() {
    this.currentBooking = { ...this.data.booking };

    // Fix object references for UI bindings
    if (this.currentBooking.customer && typeof this.currentBooking.customer === 'object') {
      const cusAny = this.currentBooking.customer as any;
      this.currentBooking.customer = cusAny._id || cusAny.id || cusAny;
    }

    if (this.currentBooking.bank_detail && typeof this.currentBooking.bank_detail === 'object') {
      const bankAny = this.currentBooking.bank_detail as any;
      this.currentBooking.bank_detail = bankAny._id || bankAny.id || bankAny;
    }

    // Format dates for input[type="date"]
    if (this.currentBooking.start_date) {
      const sdAny = this.currentBooking.start_date as any;
      if (typeof sdAny === 'string' && sdAny.includes('T')) {
        this.currentBooking.start_date = sdAny.split('T')[0];
      } else if (sdAny instanceof Date) {
        this.currentBooking.start_date = sdAny.toISOString().split('T')[0];
      }
    }

    if (this.currentBooking.end_date) {
      const edAny = this.currentBooking.end_date as any;
      if (typeof edAny === 'string' && edAny.includes('T')) {
        this.currentBooking.end_date = edAny.split('T')[0];
      } else if (edAny instanceof Date) {
        this.currentBooking.end_date = edAny.toISOString().split('T')[0];
      }
    }

    if (this.currentBooking.items) {
      this.selectedItemIds = this.currentBooking.items.map(i => {
        const itemAny = i.item as any;
        return itemAny?._id || itemAny?.id || itemAny;
      });
    }
  }

  ngOnInit() {
    this.bankService.getAll().subscribe(data => {
      this.bankDetails.set(data);
      if (!this.currentBooking.bank_detail && data.length > 0) {
        const defaultBank = data.find(b => b.is_default);
        if (defaultBank) {
          this.currentBooking.bank_detail = defaultBank._id || defaultBank.id;
        }
      }
    });

    // Auto-detect status for new bookings if not already set
    if (!this.data.isEditing) {
      this.detectInitialStatus();
    }
  }

  detectInitialStatus() {
    if (!this.currentBooking.start_date) return;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(this.currentBooking.start_date as string);
    start.setHours(0, 0, 0, 0);

    if (start.getTime() <= now.getTime()) {
      this.currentBooking.status = 'active';
    } else {
      this.currentBooking.status = 'pending';
    }
  }

  onItemsChange(ids: string[]) {
    this.selectedItemIds = ids;
    if (!this.currentBooking.items) this.currentBooking.items = [];

    // Update items array while preserving existing ones if needed
    this.currentBooking.items = ids.map(id => {
      const existing = this.currentBooking.items?.find(i => {
        const itemAny = i.item as any;
        const itemId = itemAny?._id || itemAny?.id || itemAny;
        return itemId === id;
      });
      if (existing) return existing;

      const itemData = this.data.items.find((i: RentalItem) => (i._id || i.id) === id);
      return {
        item: id,
        quantity: 1,
        rate: itemData?.daily_rate || 0
      };
    });

    this.calculateAmount();
  }

  calculateAmount() {
    if (this.currentBooking.start_date && this.currentBooking.end_date) {
      const start = new Date(this.currentBooking.start_date as string);
      const end = new Date(this.currentBooking.end_date as string);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      this.currentBooking.duration_days = diffDays;
    }

    if (this.currentBooking.items && this.currentBooking.duration_days) {
      const totalDailyRate = this.currentBooking.items.reduce((sum, i) => sum + i.rate, 0);
      this.currentBooking.amount = totalDailyRate * this.currentBooking.duration_days;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.currentBooking);
  }
}
