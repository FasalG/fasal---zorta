import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from "./shared/components/data-table/data-table.component";
import { FormFieldWrapperComponent } from "./shared/components/form-field-wrapper/form-field-wrapper.component";
import { GlobalLoaderComponent } from './shared/components/global-loader/global-loader.component';
import { ActionButtonComponent } from './shared/components/action-button/action-button.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bizarabia.webng');
}
