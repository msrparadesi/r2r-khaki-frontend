import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-pet-mood-selection',
  imports: [CommonModule],
  templateUrl: './pet-mood-selection.html',
  styleUrl: './pet-mood-selection.sass',
})
export class PetMoodSelectionComponent implements OnInit {
  protected petType: string = '';
  protected petName: string = '';
  protected petEmoji: string = '';
  protected isLoading: boolean = false;
  protected errorMessage: string = '';

  private readonly petEmojis: Record<string, string> = {
    dog: '🐕',
    cat: '🐈',
    hamster: '🐹',
  };

  private readonly moodToPoopData: Record<string, {consistency: string; color: string}> = {
    sad: { consistency: 'soft', color: 'yellow' },
    hungry: { consistency: 'firm', color: 'brown' },
    worried: { consistency: 'loose', color: 'black' },
    incredible: { consistency: 'firm', color: 'green' }
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.petType = this.route.snapshot.paramMap.get('type') || 'dog';
    this.petName = sessionStorage.getItem('petName') || 'Pet';
    this.petEmoji = this.petEmojis[this.petType] || '🐕';

    // Redirect if no pet name is set
    if (!sessionStorage.getItem('petName')) {
      this.router.navigate(['/pet-name', this.petType]);
    }
  }

  protected selectMood(mood: string): void {
    // Store selected mood and pet info
    sessionStorage.setItem('userMood', mood);
    sessionStorage.setItem('petType', this.petType);
    
    const poopData = this.moodToPoopData[mood] || { consistency: 'firm', color: 'brown' };
    sessionStorage.setItem('poopConsistency', poopData.consistency);
    sessionStorage.setItem('poopColor', poopData.color);
    
    // Navigate directly to poopcast - API calls happen there
    this.router.navigate(['/poopcast']);
  }
}
