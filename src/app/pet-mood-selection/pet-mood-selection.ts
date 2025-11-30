import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {PoopAnalysisService} from '../services/poop-analysis.service';

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

  private readonly moodToPoopData: Record<string, {consistency: string, color: string}> = {
    sad: { consistency: 'soft', color: 'light brown' },
    hungry: { consistency: 'firm', color: 'brown' },
    worried: { consistency: 'loose', color: 'dark brown' },
    incredible: { consistency: 'firm', color: 'brown' }
  };

  private readonly poopAnalysisService = inject(PoopAnalysisService);

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
    
    this.isLoading = true;
    this.errorMessage = '';

    const poopData = this.moodToPoopData[mood] || { consistency: 'firm', color: 'brown' };

    const requestData = {
      petName: this.petName,
      petType: this.petType,
      foodType: 'pedigree',
      consistency: poopData.consistency,
      color: poopData.color
    };

    console.log('Sending analysis request:', requestData);

    this.poopAnalysisService.analyzePoopData(requestData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Analysis response:', response);
        
        // Store response in session storage
        sessionStorage.setItem('analysisResponse', JSON.stringify(response));
        
        // Navigate to results page or show results
        this.router.navigate(['/poopcast']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to analyze data. Please try again.';
        console.error('Analysis error:', error);
      }
    });
  }
}
