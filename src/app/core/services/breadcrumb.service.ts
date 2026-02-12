import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

export interface Breadcrumb {
    label: string;
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
    breadcrumbs$ = this._breadcrumbs$.asObservable();

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        // Handle subsequent navigations
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.updateBreadcrumbs();
            });

        // Initialize breadcrumbs immediately for page refresh
        this.updateBreadcrumbs();
    }

    private updateBreadcrumbs(): void {
        const root = this.activatedRoute.root;
        console.log(root, 'breadcrumb');
        const breadcrumbs = this.createBreadcrumbs(root);
        this._breadcrumbs$.next(breadcrumbs);
    }

    private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
        const children = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            // Only handle primary outlet children
            if (child.outlet !== 'primary') {
                continue;
            }

            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            const label = child.snapshot.data['breadcrumb'];
            if (label) {
                // Check if this breadcrumb already exists to avoid duplicates
                const existing = breadcrumbs.find(b => b.url === url);
                if (!existing) {
                    breadcrumbs.push({ label, url });
                }
            }

            return this.createBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}
