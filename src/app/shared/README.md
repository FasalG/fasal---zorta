## Shared components (Angular Material)

This folder provides reusable, standalone Angular Material components and core services used across the app.

Usage examples

- Add the global loader to your root layout (e.g., in `layout/header` or `app-root` template):

  <shared-global-loader></shared-global-loader>

- Use the `FormFieldWrapperComponent` to wrap inputs:

  <shared-form-field label="Name" [control]="nameControl">
    <input matInput [formControl]="nameControl" placeholder="Enter name" />
  </shared-form-field>

- Use the `ActionButtonComponent` for save/delete buttons:

  <shared-action-button variant="save" (pressed)="onSave()"></shared-action-button>
  <shared-action-button variant="delete" (pressed)="onDelete()"></shared-action-button>

- Use the `ConfirmDialogService` for confirm flows:

  await confirmDialog.confirm({ title: 'Delete', message: 'Confirm delete?', destructive: true });

- Use the `SnackbarService` for toast messages:

  snackbar.success('Saved successfully');

- Use the `DataTableComponent` for lists:

  <shared-data-table [data]="items" [columns]="columns" (rowClick)="select($event)"></shared-data-table>

Imports

All components are standalone. In a consuming component add them to the `imports` array, for example:

```ts
import { FormFieldWrapperComponent } from './shared/components/form-field-wrapper/form-field-wrapper.component';

@Component({
  standalone: true,
  imports: [FormFieldWrapperComponent],
  templateUrl: './my-page.html'
})
export class MyPage {}
```

Alternatively, import `src/app/shared/material.ts` to get common Material modules.
