import { Routes } from '@angular/router';

/**
 * INVENTORY FEATURE ROUTES
 * 
 * Inventory and warehouse management
 * 
 * Usage: /app/inventory
 */
export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./inventory-list/inventory-list.component').then(m => m.InventoryListComponent),
    data: { title: 'Inventory - BizArabia ERP' }
  }
];
