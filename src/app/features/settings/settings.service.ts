import { Injectable, inject } from '@angular/core';
import { RestService } from '../../core/api-services/api.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private restService = inject(RestService);

    // Add settings related methods here
}
