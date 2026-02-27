import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Booking } from '../models/rental.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private readonly endpoint = 'bookings';

    constructor(private api: ApiService) { }

    getAll(): Observable<Booking[]> {
        return this.api.get<Booking[]>(this.endpoint);
    }

    getById(id: string): Observable<Booking> {
        return this.api.get<Booking>(`${this.endpoint}/${id}`);
    }

    add(item: Booking): Observable<Booking> {
        return this.api.post<Booking>(this.endpoint, item);
    }

    update(item: Booking): Observable<Booking> {
        const id = item._id || item.id;
        return this.api.put<Booking>(`${this.endpoint}/${id}`, item);
    }

    delete(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }

    generateCode(prefix: string): string {
        return `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }

    downloadInvoice(id: string): Observable<Blob> {
        return this.api.getFile(`${this.endpoint}/${id}/invoice`);
    }

    downloadReceipt(id: string): Observable<Blob> {
        return this.api.getFile(`${this.endpoint}/${id}/receipt`);
    }
}
