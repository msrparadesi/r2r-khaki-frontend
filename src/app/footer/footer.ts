import {Component} from '@angular/core';

/**
 * Footer component displaying application information and copyright.
 * Shown on all pages of the application.
 */
@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.sass',
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();
}
