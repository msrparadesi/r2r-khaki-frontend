import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-pet-mood-selection',
  imports: [],
  templateUrl: './pet-mood-selection.html',
  styleUrl: './pet-mood-selection.sass',
})
export class PetMoodSelectionComponent implements OnInit {
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
    this.petName = sessionStorage.getItem('petName') || 'Pet';
    this.petEmoji = this.petEmojis[this.petType] || '🐕';

    // Redirect if no pet name is set
    if (!sessionStorage.getItem('petName')) {
      this.router.navigate(['/pet-name', this.petType]);
    }
  }

  protected selectMood(mood: string): void {
    // Store selected mood
    sessionStorage.setItem('userMood', mood);
    
    // TODO: Navigate to chat interface or backend integration
    console.log(`User selected mood: ${mood} for pet: ${this.petName} (${this.petType})`);
    
    // For now, show an alert (will be replaced with actual chat interface)
    alert(`Great! ${this.petName} will help you with your ${mood} mood. Chat interface coming soon!`);
  }
}
