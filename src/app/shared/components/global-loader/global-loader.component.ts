import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'shared-global-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './global-loader.component.html',
  styleUrls: ['./global-loader.component.scss']
})
export class GlobalLoaderComponent {
  constructor(public loader: LoaderService) {}
}
