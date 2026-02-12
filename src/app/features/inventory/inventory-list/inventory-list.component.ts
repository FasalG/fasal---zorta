import { Component } from '@angular/core';

/**
 * Inventory List Component
 * 
 * Inventory and warehouse management page
 */
@Component({
  selector: 'app-inventory-list',
  standalone: true,
  template: `
    <div class="inventory-container">
      <div class="inventory-header">
        <h1>Inventory</h1>
        <p>Manage warehouse and stock operations</p>
        <button class="create-btn">+ New Product</button>
      </div>
      
      <div class="inventory-content">
        <div class="inventory-card">
          <h3>📦 Products</h3>
          <p>Manage product catalog and details</p>
          <button>View Products</button>
        </div>
        <div class="inventory-card">
          <h3>🏢 Warehouses</h3>
          <p>Manage warehouse locations</p>
          <button>View Warehouses</button>
        </div>
        <div class="inventory-card">
          <h3>📊 Stock Levels</h3>
          <p>Monitor inventory stock levels</p>
          <button>View Stock</button>
        </div>
        <div class="inventory-card">
          <h3>📥 Inbound</h3>
          <p>Receive and manage inbound shipments</p>
          <button>View Inbound</button>
        </div>
        <div class="inventory-card">
          <h3>📤 Outbound</h3>
          <p>Manage outbound shipments</p>
          <button>View Outbound</button>
        </div>
        <div class="inventory-card">
          <h3>🔄 Transfers</h3>
          <p>Transfer inventory between warehouses</p>
          <button>View Transfers</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 24px;
    }

    .inventory-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .inventory-header h1 {
      font-size: 28px;
      margin: 0;
      color: #333;
    }

    .inventory-header p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .create-btn {
      padding: 10px 20px;
      background-color: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .create-btn:hover {
      background-color: #5568d3;
    }

    .inventory-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }

    .inventory-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .inventory-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .inventory-card h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 16px;
    }

    .inventory-card p {
      color: #666;
      margin: 0 0 16px 0;
      font-size: 13px;
    }

    .inventory-card button {
      width: 100%;
      padding: 10px;
      background-color: #f0f0f0;
      color: #333;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .inventory-card button:hover {
      background-color: #667eea;
      color: white;
      border-color: #667eea;
    }
  `]
})
export class InventoryListComponent {}
