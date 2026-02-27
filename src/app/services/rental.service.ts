import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Rental } from '../models/rental.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RentalService {
    private readonly endpoint = 'rentals';

    constructor(private api: ApiService) { }

    getAll(): Observable<Rental[]> {
        return this.api.get<Rental[]>(this.endpoint);
    }

    getById(id: string): Observable<Rental> {
        return this.api.get<Rental>(`${this.endpoint}/${id}`);
    }

    add(item: Rental): Observable<Rental> {
        return this.api.post<Rental>(this.endpoint, item);
    }

    update(item: Rental): Observable<Rental> {
        const id = item._id || item.id;
        return this.api.put<Rental>(`${this.endpoint}/${id}`, item);
    }

    delete(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }

    generateCode(prefix: string): string {
        return `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }
}
