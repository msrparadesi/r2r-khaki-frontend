import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-pet-name-input',
  imports: [FormsModule, CommonModule],
  templateUrl: './pet-name-input.html',
  styleUrl: './pet-name-input.sass',
})
export class PetNameInputComponent implements OnInit {
  protected petType: string = '';
  protected petName: string = '';
  protected petEmoji: string = '';

  private readonly petEmojis: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    hamster: '🐹',
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.petType = this.route.snapshot.paramMap.get('type') || 'dog';
    this.petEmoji = this.petEmojis[this.petType] || '🐕';
  }

  protected onSubmit(): void {
    if (this.petName.trim()) {
      // Store pet name in session storage for later use
      sessionStorage.setItem('petName', this.petName.trim());
      sessionStorage.setItem('petType', this.petType);
      
      // Navigate to mood selection
      this.router.navigate(['/pet-mood', this.petType]);
    }
  }
}
