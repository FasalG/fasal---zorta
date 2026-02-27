import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Customer } from '../models/rental.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private readonly endpoint = 'customers';

    constructor(private api: ApiService) { }

    getAll(): Observable<Customer[]> {
        return this.api.get<Customer[]>(this.endpoint);
    }

    getById(id: string): Observable<Customer> {
        return this.api.get<Customer>(`${this.endpoint}/${id}`);
    }

    add(item: Customer): Observable<Customer> {
        return this.api.post<Customer>(this.endpoint, item);
    }

    update(item: Customer): Observable<Customer> {
        const id = item._id || item.id;
        return this.api.put<Customer>(`${this.endpoint}/${id}`, item);
    }

    delete(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }

    generateCode(prefix: string): string {
        return `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }
}
