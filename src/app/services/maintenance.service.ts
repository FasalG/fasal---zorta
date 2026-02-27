import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Maintenance } from '../models/rental.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {
    private readonly endpoint = 'maintenance';

    constructor(private api: ApiService) { }

    getAll(): Observable<Maintenance[]> {
        return this.api.get<Maintenance[]>(this.endpoint);
    }

    getById(id: string): Observable<Maintenance> {
        return this.api.get<Maintenance>(`${this.endpoint}/${id}`);
    }

    add(item: Maintenance): Observable<Maintenance> {
        return this.api.post<Maintenance>(this.endpoint, item);
    }

    update(item: Maintenance): Observable<Maintenance> {
        const id = item._id || item._id;
        return this.api.put<Maintenance>(`${this.endpoint}/${id}`, item);
    }

    delete(id: string): Observable<any> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }
}
