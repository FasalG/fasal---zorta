import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { CustomerService } from '../../services/customer.service';
import { InventoryService } from '../../services/inventory.service';
import { RentalService } from '../../services/rental.service';
import { Booking, Invoice, Customer, RentalItem } from '../../models/rental.models';
import { BookingFormDialogComponent } from '../../features/bookings/components/booking-form-dialog/booking-form-dialog.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="h3 fw-bold text-dark mb-0">Bookings & Reservations</h2>
          <p class="text-secondary mb-0">Manage customer reservations and future rentals</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" (click)="openBookingDialog()">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </button>
      </div>

      <!-- Stats -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-3">
          <div class="card shadow-sm border-0 p-3 h-100">
            <p class="text-secondary small mb-1">Active Bookings</p>
            <p class="h4 fw-bold text-success mb-0">{{ activeCount() }}</p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="card shadow-sm border-0 p-3 h-100">
            <p class="text-secondary small mb-1">Pending Confirmation</p>
            <p class="h4 fw-bold text-warning-emphasis mb-0">{{ pendingCount() }}</p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="card shadow-sm border-0 p-3 h-100">
            <p class="text-secondary small mb-1">Total Booking Value</p>
            <p class="h4 fw-bold text-primary mb-0">{{ totalBookingValue() | currency:'INR':'symbol' }}</p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="card shadow-sm border-0 p-3 h-100">
            <p class="text-secondary small mb-1">Cancelled</p>
            <p class="h4 fw-bold text-danger mb-0">{{ cancelledCount() }}</p>
          </div>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="card shadow-sm border-0 overflow-hidden mb-4">
        <div class="card-header bg-white border-0 p-4 pb-0">
          <h5 class="fw-bold mb-0">Current Reservations</h5>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-4 py-3 text-secondary small text-uppercase fw-medium border-0">Booking #</th>
                <th class="px-4 py-3 text-secondary small text-uppercase fw-medium border-0">Customer</th>
                <th class="px-4 py-3 text-secondary small text-uppercase fw-medium border-0">Equipment</th>
                <th class="px-4 py-3 text-secondary small text-uppercase fw-medium border-0">Dates</th>
                <th class="px-4 py-3 text-secondary small text-uppercase fw-medium border-0">Amount</th>
                <th class="px-4 py-3 text-secondary small text-uppercase fw-medium border-0">Status</th>
                <th class="px-4 py-3 text-secondary small text-uppercase fw-medium border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let booking of bookings()" class="hover-bg-light">
                <td class="px-4 py-3 small fw-medium text-dark">{{ booking.booking_number }}</td>
                <td class="px-4 py-3 small text-secondary">{{ getCustomerName(booking.customer) }}</td>
                <td class="px-4 py-3 small fw-medium text-dark">
                  <div class="d-flex flex-column gap-1">
                    <span *ngFor="let itemWrap of booking.items" class="badge bg-light text-dark border fw-normal text-start">
                      {{ getItemName(itemWrap.item) }} (x{{ itemWrap.quantity }})
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 small text-secondary">
                   <div>{{ booking.start_date | date:'mediumDate' }}</div>
                   <div class="smaller text-muted">to {{ booking.end_date | date:'mediumDate' }}</div>
                </td>
                <td class="px-4 py-3 small fw-bold text-dark">
                  <div>{{ booking.amount | currency:'INR':'symbol' }}</div>
                  <div class="smaller text-success" *ngIf="booking.initial_payment_received > 0">
                    Paid: {{ booking.initial_payment_received | currency:'INR':'symbol' }}
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span [class]="getStatusClass(booking.status)">
                    {{ booking.status | titlecase }}
                  </span>
                </td>
                <td class="px-4 py-3 text-end">
                  <div class="d-flex align-items-center justify-content-end gap-1">
                    <button class="btn btn-sm btn-outline-primary p-1 border-0" title="Download Invoice" *ngIf="['pending', 'active'].includes(booking.status)" (click)="downloadInvoice(booking)">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button class="btn btn-sm btn-outline-info p-1 border-0" title="Download Receipt" *ngIf="booking.initial_payment_received > 0" (click)="downloadReceipt(booking)">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>

                    <button class="btn btn-sm btn-link p-1 text-primary" (click)="openBookingDialog(booking)">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button class="btn btn-sm btn-link p-1 text-danger" (click)="deleteBooking((booking._id || booking.id)!)" *ngIf="['pending', 'confirmed'].includes(booking.status)">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-bg-light:hover { background-color: var(--bs-light); }
    .smaller { font-size: 0.75rem; }
  `]
})
export class BookingsComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  customers = signal<Customer[]>([]);
  items = signal<RentalItem[]>([]);

  activeCount = computed(() => {
    return this.bookings().filter(b => b.status === 'active').length;
  });

  pendingCount = computed(() => {
    return this.bookings().filter(b => b.status === 'pending').length;
  });

  cancelledCount = computed(() => {
    return this.bookings().filter(b => b.status === 'cancelled').length;
  });

  totalBookingValue = computed(() => {
    return this.bookings().filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.amount, 0);
  });

  private bookingService = inject(BookingService);
  private customerService = inject(CustomerService);
  private inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadBookings();
    this.loadCustomers();
    this.loadItems();
  }

  loadBookings() {
    this.bookingService.getAll().subscribe(data => this.bookings.set(data));
  }

  loadCustomers() {
    this.customerService.getAll().subscribe(data => this.customers.set(data));
  }

  loadItems() {
    this.inventoryService.getAll().subscribe(data => this.items.set(data));
  }

  getEmptyBooking(): Partial<Booking> {
    return {
      customer: '',
      items: [],
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      duration_days: 1,
      amount: 0,
      initial_payment_received: 0,
      payment_method: 'none',
      status: 'pending'
    };
  }

  getCustomerName(data: any): string {
    if (!data) return 'Unknown';
    if (typeof data === 'object' && data.name) return data.name;
    return this.customers().find(c => (c._id || c.id) === data)?.name || 'Unknown';
  }

  getItemName(data: any): string {
    if (!data) return 'Unknown';
    if (typeof data === 'object' && data.name) return data.name;
    return this.items().find(i => (i._id || i.id) === data)?.name || 'Unknown';
  }

  getStatusClass(status: string): string {
    const base = 'badge rounded-pill fw-normal px-3 py-2';
    switch (status) {
      case 'active': return `${base} bg-success text-white border border-success`;
      case 'confirmed': return `${base} bg-success-subtle text-success border border-success`;
      case 'pending': return `${base} bg-warning-subtle text-warning-emphasis border border-warning`;
      case 'cancelled': return `${base} bg-danger-subtle text-danger border border-danger`;
      case 'closed': return `${base} bg-secondary-subtle text-secondary border border-secondary`;
      default: return `${base} bg-secondary-subtle text-secondary border border-secondary`;
    }
  }

  openBookingDialog(booking?: Booking) {
    const dialogRef = this.dialog.open(BookingFormDialogComponent, {
      data: {
        booking: booking ? { ...booking } : this.getEmptyBooking(),
        isEditing: !!booking,
        customers: this.customers(),
        items: this.items()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (booking) {
          this.bookingService.update(result as Booking).subscribe({
            next: () => this.loadBookings(),
            error: (err) => alert(err.error?.message || 'Failed to update booking')
          });
        } else {
          const newBooking = {
            ...result,
            booking_number: this.bookingService.generateCode('BOK'),
            created_at: new Date().toISOString()
          } as Booking;
          this.bookingService.add(newBooking).subscribe({
            next: () => this.loadBookings(),
            error: (err) => alert(err.error?.message || 'Failed to create booking')
          });
        }
      }
    });
  }

  updateStatus(booking: Booking, status: 'confirmed' | 'active' | 'cancelled' | 'closed') {
    const updated = { ...booking, status };
    this.bookingService.update(updated).subscribe(() => this.loadBookings());
  }

  deleteBooking(id: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.delete(id).subscribe(() => {
        this.loadBookings();
      });
    }
  }

  downloadInvoice(booking: Booking) {
    const id = booking._id || booking.id;
    if (!id) return;
    this.bookingService.downloadInvoice(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${booking.booking_number}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Failed to download invoice')
    });
  }

  downloadReceipt(booking: Booking) {
    const id = booking._id || booking.id;
    if (!id) return;
    this.bookingService.downloadReceipt(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt-${booking.booking_number}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Failed to download receipt')
    });
  }
}
