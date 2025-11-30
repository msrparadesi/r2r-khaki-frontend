import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

/**
 * Loading spinner component for displaying async operation progress.
 * Provides visual feedback during network requests.
 */
@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  template: `
    @if (show) {
      <div class="spinner-container" [class.inline]="inline">
        <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
        @if (message) {
          <span class="spinner-message">{{ message }}</span>
        }
      </div>
    }
  `,
  styles: `
    .spinner-container
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      gap: 12px
      padding: 20px

      &.inline
        flex-direction: row
        padding: 0

    .spinner
      border: 3px solid rgba(0, 0, 0, 0.1)
      border-top-color: #4a90e2
      border-radius: 50%
      animation: spin 0.8s linear infinite

    .spinner-message
      font-size: 14px
      color: #666

    @keyframes spin
      to
        transform: rotate(360deg)
  `,
})
export class LoadingSpinnerComponent {
  /** Whether to show the spinner */
  @Input() show = false;

  /** Optional message to display below spinner */
  @Input() message?: string;

  /** Size of spinner in pixels */
  @Input() size = 40;

  /** Whether to display inline (horizontal layout) */
  @Input() inline = false;
}
