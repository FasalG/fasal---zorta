import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Expense } from '../models/rental.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private readonly endpoint = 'expenses';

    constructor(private api: ApiService) { }

    getAll(): Observable<Expense[]> {
        return this.api.get<Expense[]>(this.endpoint);
    }

    getById(id: string): Observable<Expense> {
        return this.api.get<Expense>(`${this.endpoint}/${id}`);
    }

    add(item: Expense): Observable<Expense> {
        return this.api.post<Expense>(this.endpoint, item);
    }

    update(item: Expense): Observable<Expense> {
        const id = item._id || item.id;
        return this.api.put<Expense>(`${this.endpoint}/${id}`, item);
    }

    delete(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }

    generateCode(prefix: string): string {
        return `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }
}
