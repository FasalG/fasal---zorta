import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Category } from '../models/rental.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly endpoint = 'categories';

    constructor(private api: ApiService) { }

    getAll(): Observable<Category[]> {
        return this.api.get<Category[]>(this.endpoint);
    }

    getById(id: string): Observable<Category> {
        return this.api.get<Category>(`${this.endpoint}/${id}`);
    }

    add(item: Category): Observable<Category> {
        return this.api.post<Category>(this.endpoint, item);
    }

    bulkAdd(items: Category[]): Observable<Category[]> {
        return this.api.post<Category[]>(`${this.endpoint}/bulk`, items);
    }

    update(item: Category): Observable<Category> {
        const id = item._id || item.id;
        return this.api.put<Category>(`${this.endpoint}/${id}`, item);
    }

    delete(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }
}
