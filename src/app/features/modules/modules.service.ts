import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RestService } from '../../core/api-services/api.service';
import { StyModule } from './modules.interface';
import { HttpMethod } from '../../core/enum/httpmethod.enum';
import { Endpoints } from '../../core/constants/urls';

@Injectable({
    providedIn: 'root'
})
export class ModulesService {
    private restService = inject(RestService);

    /**
     * Fetches the list of modules for the current user/organization.
     * Currently returns mock data, but is hooked up to the RestService architecture.
     */
    getModules(): Observable<StyModule[]> {
        // When the backend endpoint is ready, use this:

        return this.restService.HttpRequestHandler<any[]>({
            method: HttpMethod.POST,
            endpoint: Endpoints.ADMIN.GET_MODULES, // Update with actual endpoint
            cacheTags: ['StyModule'],
            enableLogging: true
        });


        // For now, returning mock data as requested to maintain functionality
        // return of([
        //     {
        //         id: 1,
        //         name: 'Accounts',
        //         description: 'Accounting and financial management',
        //         icon: '📊',
        //         status: 'active',
        //         version: '1.0.0'
        //     },
        //     {
        //         id: 2,
        //         name: 'Inventory',
        //         description: 'Inventory and warehouse management',
        //         icon: '📦',
        //         status: 'active',
        //         version: '1.0.0'
        //     },
        //     {
        //         id: 3,
        //         name: 'Admin',
        //         description: 'System administration and configuration',
        //         icon: '⚙️',
        //         status: 'active',
        //         version: '1.0.0'
        //     },
        // ]);
    }
}
