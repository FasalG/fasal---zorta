import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/rental.models';
import { CategoryFormDialogComponent } from '../../features/categories/components/category-form-dialog/category-form-dialog.component';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="h3 fw-bold text-dark mb-0">Category Management</h2>
          <p class="text-secondary mb-0">Manage rental item categories</p>
        </div>
        <div class="d-flex gap-2">
          <div class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 px-3 shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li>
                <button class="dropdown-item d-flex align-items-center gap-2 py-2" (click)="exportToExcel()">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-success">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export to Excel
                </button>
              </li>
              <li>
                <button class="dropdown-item d-flex align-items-center gap-2 py-2" (click)="downloadTemplate()">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-secondary">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Template
                </button>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <label class="dropdown-item d-flex align-items-center gap-2 py-2 cursor-pointer" [class.disabled]="isImporting()" style="cursor: pointer;">
                  <span *ngIf="isImporting()" class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
                  <svg *ngIf="!isImporting()" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-primary">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {{ isImporting() ? 'Importing...' : 'Import from Excel' }}
                  <input type="file" (change)="onFileUpload($event)" accept=".xlsx, .xls" style="display: none;" [disabled]="isImporting()">
                </label>
              </li>
            </ul>
          </div>
          <button class="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm" (click)="openCategoryDialog()">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>
      </div>

      <div class="card shadow-sm border-0 overflow-hidden mb-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-secondary small text-uppercase fw-medium">
              <tr>
                <th class="px-4 py-3 border-0">Name</th>
                <th class="px-4 py-3 border-0">Description</th>
                <th class="px-4 py-3 border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr *ngFor="let category of categories()" class="hover-bg-light">
                <td class="px-4 py-3 small fw-bold text-dark">{{ category.name }}</td>
                <td class="px-4 py-3 small text-secondary">{{ category.description }}</td>
                <td class="px-4 py-3 text-end">
                  <div class="d-flex align-items-center justify-content-end gap-1">
                    <button class="btn btn-sm btn-link p-1 text-primary" (click)="openCategoryDialog(category)">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button class="btn btn-sm btn-link p-1 text-danger" (click)="deleteCategory((category._id || category.id)!)">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-bg-light:hover { background-color: var(--bs-light); }
    .cursor-pointer { cursor: pointer; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  isImporting = signal(false);

  private categoryService = inject(CategoryService);
  private excelService = inject(ExcelService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(data => this.categories.set(data));
  }

  getEmptyCategory(): Partial<Category> {
    return {
      name: '',
      description: ''
    };
  }

  openCategoryDialog(category?: Category) {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      data: {
        category: category ? { ...category } : this.getEmptyCategory(),
        isEditing: !!category
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (category) {
          this.categoryService.update(result as Category).subscribe(() => this.loadCategories());
        } else {
          this.categoryService.add(result as Category).subscribe(() => this.loadCategories());
        }
      }
    });
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  // Excel Export Logic
  exportToExcel() {
    const exportData = this.categories().map(category => ({
      'Category Name': category.name,
      'Description': category.description || ''
    }));

    this.excelService.exportToFile(exportData, 'Categories_Data', 'Categories');
  }

  downloadTemplate() {
    const templateData = [{
      'Category Name': 'Example Category (e.g. Cameras)',
      'Description': 'Photographic equipment, lenses, and accessories'
    }];
    this.excelService.exportToFile(templateData, 'Category_Import_Template', 'Template');
  }

  async onFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isImporting.set(true);

    try {
      const importedData = await this.excelService.parseFile(file);

      if (!importedData || importedData.length === 0) {
        alert('No data found in the Excel file.');
        this.isImporting.set(false);
        return;
      }

      const validCategories: Category[] = [];
      const errors: string[] = [];

      importedData.forEach((row, index) => {
        const categoryName = row['Category Name'];
        if (!categoryName) {
          errors.push(`Row ₹{index + 2}: Missing "Category Name".`);
          return;
        }

        const newCategory: Category = {
          name: categoryName,
          description: row['Description'] || ''
        };
        validCategories.push(newCategory);
      });

      if (errors.length > 0) {
        alert(`Found ₹{errors.length} issues in the file:\n\n₹{errors.slice(0, 5).join('\n')}₹{errors.length > 5 ? '\n...and more.' : ''}\n\nPlease fix them and try again.`);
        this.isImporting.set(false);
        event.target.value = '';
        return;
      }

      if (validCategories.length > 0) {
        this.categoryService.bulkAdd(validCategories).subscribe({
          next: () => {
            this.loadCategories();
            alert(`Successfully imported ₹{validCategories.length} categories!`);
            this.isImporting.set(false);
            event.target.value = '';
          },
          error: (err) => {
            console.error('Import error:', err);
            alert('Failed to import categories. There might be a backend error.');
            this.isImporting.set(false);
            event.target.value = '';
          }
        });
      }
    } catch (err: any) {
      alert(`Error reading file: ₹{err.message}`);
      this.isImporting.set(false);
      event.target.value = '';
    }
  }
}
