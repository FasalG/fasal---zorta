import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class OrgContextService {
    private router = inject(Router);

    // Signal to store the current organization/company ID
    private orgIdSignal = signal<string | null>(null);

    // Readonly signal for components to subscribe to
    readonly currentOrgId = this.orgIdSignal.asReadonly();

    // Helper to check if context is set
    readonly hasContext = computed(() => !!this.orgIdSignal());

    /**
     * Updates the organization context.
     * Usually called by a higher-level guard or the main layout.
     */
    setOrgId(id: string | null) {
        if (this.orgIdSignal() !== id) {
            this.orgIdSignal.set(id);
            console.log(`[OrgContext] Switched to organization: ${id}`);
        }
    }

    /**
     * Navigate relative to current organization
     * Usage: this.orgContext.navigateTo(['accounts', 'ledger'])
     */
    navigateTo(commands: any[], extras?: any) {
        const orgId = this.orgIdSignal();
        if (orgId) {
            this.router.navigate(['app', orgId, ...commands], extras);
            console.log('app', orgId, ...commands);
        } else {
            console.error('[OrgContext] Cannot navigate: orgId is not set.');
            this.router.navigate(['auth/login']);
        }
    }

    /**
     * Resets the context on logout
     */
    clearContext() {
        this.orgIdSignal.set(null);
    }
}

