import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  async confirm(data: ConfirmDialogData): Promise<boolean> {
    const ref = this.dialog.open(ConfirmDialogComponent, { data, disableClose: true });
    const result = await firstValueFrom(ref.afterClosed());
    return !!result;
  }
}
