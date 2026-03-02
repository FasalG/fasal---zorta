import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalService } from '../../services/rental.service';
import { InventoryService } from '../../services/inventory.service';
import { BookingService } from '../../services/booking.service';
import { ExpenseService } from '../../services/expense.service';
import { CustomerService } from '../../services/customer.service';
import { RentalItem, Booking, Expense, Customer } from '../../models/rental.models';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Loader -->
    <div class="text-center py-5 my-5" *ngIf="isLoading()">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-2 text-secondary small">Setting up your dashboard...</div>
    </div>

    <ng-container *ngIf="!isLoading()">
      <div class="row g-4 mb-4">
        <div class="col-12 col-md-6 col-lg-3">
        <div class="card shadow-sm border-0 p-4 h-100">
          <div class="d-flex align-items-center gap-3">
            <div class="p-3 bg-primary-subtle rounded-3 text-primary shadow-sm">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-12a9 9 0 110 18 9 9 0 010-18zm0 0V3m0 18v-3" />
              </svg>
            </div>
            <div>
              <p class="text-secondary small mb-1">Total Revenue</p>
              <h3 class="fw-bold mb-0">{{ totalRevenue() | currency:'INR':'symbol' }}</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card shadow-sm border-0 p-4 h-100">
          <div class="d-flex align-items-center gap-3">
            <div class="p-3 bg-success-subtle rounded-3 text-success shadow-sm">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p class="text-secondary small mb-1">Active Rentals</p>
              <h3 class="fw-bold mb-0">{{ activeRentalsCount() }}</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card shadow-sm border-0 p-4 h-100">
          <div class="d-flex align-items-center gap-3">
            <div class="p-3 bg-info-subtle rounded-3 text-info shadow-sm">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-secondary small mb-1">Items Available</p>
              <h3 class="fw-bold mb-0">{{ availableItemsCount() }}</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card shadow-sm border-0 p-4 h-100">
          <div class="d-flex align-items-center gap-3">
            <div class="p-3 bg-warning-subtle rounded-3 text-warning-emphasis shadow-sm">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-secondary small mb-1">Pending Bookings</p>
              <h3 class="fw-bold mb-0">{{ pendingBookingsCount() }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12 col-lg-8">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Recent Rentals</h5>
            <button class="btn btn-sm btn-link text-decoration-none fw-semibold">View All</button>
          </div>
          <div class="table-responsive p-0">
            <table class="table table-hover align-middle mt-3 mb-0">
              <thead class="table-light text-secondary small text-uppercase">
                <tr>
                  <th class="px-4 py-3 border-0">Item</th>
                  <th class="px-4 py-3 border-0">Customer</th>
                  <th class="px-4 py-3 border-0">End Date</th>
                  <th class="px-4 py-3 border-0">Amount</th>
                  <th class="px-4 py-3 border-0">Status</th>
                </tr>
              </thead>
              <tbody class="border-top-0">
                <tr *ngFor="let booking of recentRentals()" class="small">
                  <td class="px-4 py-3 fw-medium text-dark">
                    {{ getItemName(booking.items[0]?.item) }}
                    <span *ngIf="booking.items.length > 1" class="text-secondary smaller ms-1">+{{ booking.items.length - 1 }}</span>
                  </td>
                  <td class="px-4 py-3 text-secondary">{{ getCustomerName(booking.customer) }}</td>
                  <td class="px-4 py-3 text-secondary">{{ booking.end_date | date:'mediumDate' }}</td>
                  <td class="px-4 py-3 fw-bold text-dark">{{ booking.amount | currency:'INR':'symbol' }}</td>
                  <td class="px-4 py-3">
                    <span [class]="booking.status === 'closed' ? 'badge bg-secondary' : 'badge bg-success-subtle text-success'">
                      {{ booking.status | titlecase }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="recentRentals().length === 0">
                  <td colspan="5" class="text-center py-4 text-secondary">No recent bookings found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="card shadow-sm border-0 h-100 p-4">
          <h5 class="fw-bold mb-4">Financial Summary</h5>
          <div class="d-flex flex-column gap-3">
            <div class="p-3 bg-light rounded-3">
              <p class="small text-secondary mb-1">Monthly Expenses</p>
              <h4 class="fw-bold text-danger mb-0">{{ monthlyExpenses() | currency:'INR':'symbol' }}</h4>
            </div>
            <div class="p-3 bg-light rounded-3">
              <p class="small text-secondary mb-1">Monthly Gross Profit</p>
              <h4 class="fw-bold text-success mb-0">{{ grossProfit() | currency:'INR':'symbol' }}</h4>
            </div>
            <hr class="my-2 border-secondary opacity-10">
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="small fw-semibold text-secondary">Outstanding Payments</span>
              <span class="fw-bold text-warning-emphasis">{{ outstandingPayments() | currency:'INR':'symbol' }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="small fw-semibold text-secondary">Utilization Rate</span>
              <span class="fw-bold text-primary">{{ utilizationRate() }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ng-container>
  `
})
export class DashboardComponent implements OnInit {
  isLoading = signal(true);
  items = signal<RentalItem[]>([]);
  bookings = signal<Booking[]>([]);
  expenses = signal<Expense[]>([]);
  customers = signal<Customer[]>([]);

  totalRevenue = computed(() => this.bookings().reduce((sum, b) => b.status !== 'cancelled' ? sum + b.amount : sum, 0));
  activeRentalsCount = computed(() => this.bookings().filter(b => b.status === 'active').length);

  availableItemsCount = computed(() => {
    const totalItems = this.items().reduce((sum, item) => sum + item.total_quantity, 0);
    const rentedItems = this.bookings()
      .filter(b => b.status === 'active')
      .reduce((sum, b) => {
        return sum + b.items.reduce((itemSum, i) => itemSum + i.quantity, 0);
      }, 0);
    return Math.max(0, totalItems - rentedItems);
  });

  pendingBookingsCount = computed(() => this.bookings().filter(b => b.status === 'pending').length);
  recentRentals = computed(() => [...this.bookings()].reverse().slice(0, 5));
  monthlyExpenses = computed(() => this.expenses().reduce((sum, e) => sum + e.amount, 0));
  grossProfit = computed(() => this.totalRevenue() - this.monthlyExpenses());

  outstandingPayments = computed(() => this.bookings().reduce((sum, b) => {
    if (b.status === 'cancelled') return sum;
    return sum + Math.max(0, b.amount - (b.initial_payment_received || 0));
  }, 0));

  utilizationRate = computed(() => {
    const total = this.items().reduce((sum, i) => sum + i.total_quantity, 0);
    if (total === 0) return '0';
    const rented = total - this.availableItemsCount();
    return ((rented / total) * 100).toFixed(1);
  });

  private inventoryService = inject(InventoryService);
  private bookingService = inject(BookingService);
  private expenseService = inject(ExpenseService);
  private customerService = inject(CustomerService);

  ngOnInit() {
    this.isLoading.set(true);
    forkJoin({
      items: this.inventoryService.getAll().pipe(catchError(() => of([]))),
      bookings: this.bookingService.getAll().pipe(catchError(() => of([]))),
      expenses: this.expenseService.getAll().pipe(catchError(() => of([]))),
      customers: this.customerService.getAll().pipe(catchError(() => of([])))
    }).subscribe({
      next: (data) => {
        this.items.set(data.items);
        this.bookings.set(data.bookings);
        this.expenses.set(data.expenses);
        this.customers.set(data.customers);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Dashboard data load error', err);
        this.isLoading.set(false);
      }
    });
  }

  getItemName(data: any): string {
    if (!data) return 'Unknown';
    const id = typeof data === 'object' ? (data._id || data.id) : data;
    return this.items().find(i => (i._id || i.id) === id)?.name || 'Unknown';
  }

  getCustomerName(data: any): string {
    if (!data) return 'Unknown';
    const id = typeof data === 'object' ? (data._id || data.id) : data;
    return this.customers().find(c => (c._id || c.id) === id)?.name || 'Unknown';
  }
}
