import { Component, EventEmitter, Input, OnChanges, Output, ViewChild, AfterViewInit, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean; // New property
  width?: string;
}

@Component({
  selector: 'shared-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatCheckboxModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T = any> implements OnChanges, AfterViewInit {
  @Input() data: T[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() pageSize = 10;
  @Input() pageable = true;
  @Input() sortable = true;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() rowClick = new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  @ContentChild('rowActions') rowActions?: TemplateRef<any>;

  datasource = new MatTableDataSource<T>([]);
  filterValues: { [key: string]: string } = {};

  constructor() {
    this.datasource.filterPredicate = this.createFilter();
  }

  ngOnChanges(): void {
    this.datasource.data = this.data || [];
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.datasource.paginator = this.paginator;
    if (this.sort) this.datasource.sort = this.sort;
  }

  applyFilter(columnKey: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues[columnKey] = filterValue.trim().toLowerCase();
    this.datasource.filter = JSON.stringify(this.filterValues);
  }

  private createFilter(): (data: T, filter: string) => boolean {
    return (data: any, filterValue: string): boolean => {
      const searchTerms = JSON.parse(filterValue);
      return Object.keys(searchTerms).every(key => {
        const value = data[key]?.toString().toLowerCase() || '';
        return value.indexOf(searchTerms[key]) !== -1;
      });
    };
  }

  get displayedColumns(): string[] {
    const cols = this.columns.map(c => c.key);
    if (this.rowActions) {
      cols.push('actions');
    }
    return cols;
  }

  onPage(e: PageEvent) {
    this.pageChange.emit(e);
  }

  onSort(e: Sort) {
    this.sortChange.emit(e);
  }

  onRowClick(row: T) {
    this.rowClick.emit(row);
  }
}
