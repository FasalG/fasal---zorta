import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
export enum SnackBarType {
  WARNING = 'alert-warning',
  ERROR = 'alert-danger',
  SUCCESS = 'alert-success',
}
@Injectable({
  providedIn: 'root',
})
export class CustomSnack {
  constructor(private snackBar: MatSnackBar) { }
  showNotification(priority: SnackBarType, content: string) {
    this.snackBar.open(content, '', {
      duration: 3000,
      panelClass: priority,
    });
  }
}
