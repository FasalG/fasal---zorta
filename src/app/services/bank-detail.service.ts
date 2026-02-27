import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { BankDetail } from '../models/rental.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BankDetailService {
    constructor(private apiService: ApiService) { }

    getAll(): Observable<BankDetail[]> {
        return this.apiService.get<BankDetail[]>('bank-details');
    }

    getById(id: string): Observable<BankDetail> {
        return this.apiService.get<BankDetail>(`bank-details/${id}`);
    }

    add(bankDetail: BankDetail): Observable<BankDetail> {
        return this.apiService.post<BankDetail>('bank-details', bankDetail);
    }

    update(bankDetail: BankDetail): Observable<BankDetail> {
        return this.apiService.put<BankDetail>(`bank-details/${bankDetail._id || bankDetail.id}`, bankDetail);
    }

    delete(id: string): Observable<any> {
        return this.apiService.delete(`bank-details/${id}`);
    }
}
