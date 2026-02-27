import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { RentalItem } from '../models/rental.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private readonly endpoint = 'items';

    constructor(private api: ApiService) { }

    getAll(): Observable<RentalItem[]> {
        return this.api.get<RentalItem[]>(this.endpoint);
    }

    getById(id: string): Observable<RentalItem> {
        return this.api.get<RentalItem>(`${this.endpoint}/${id}`);
    }

    add(item: RentalItem): Observable<RentalItem> {
        return this.api.post<RentalItem>(this.endpoint, item);
    }

    bulkAdd(items: RentalItem[]): Observable<RentalItem[]> {
        return this.api.post<RentalItem[]>(`${this.endpoint}/bulk`, items);
    }

    update(item: RentalItem): Observable<RentalItem> {
        const id = item._id || item.id;
        return this.api.put<RentalItem>(`${this.endpoint}/${id}`, item);
    }

    delete(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }
}
