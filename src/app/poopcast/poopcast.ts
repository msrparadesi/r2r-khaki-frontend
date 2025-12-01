import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoopAnalysisService, PoopAnalysisResponse } from '../services/poop-analysis.service';
import { PetAudioService, PetAudioResponse } from '../services/pet-audio.service';
import { AvatarService, AvatarGenerationResponse } from '../services/avatar.service';

type TabType = 'poop' | 'audio' | 'avatar';

@Component({
  selector: 'app-poopcast',
  imports: [CommonModule],
  templateUrl: './poopcast.html',
  styleUrl: './poopcast.sass',
})
export class Poopcast implements OnInit {
  private readonly poopService = inject(PoopAnalysisService);
  private readonly audioService = inject(PetAudioService);
  private readonly avatarService = inject(AvatarService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected activeTab: TabType = 'poop';
  protected petType: string = 'dog';
  protected petName: string = 'Pet';

  // Poop analysis state
  protected poopResult: PoopAnalysisResponse | null = null;
  protected poopLoading = false;
  protected poopError = '';

  // Audio state
  protected audioResult: PetAudioResponse | null = null;
  protected audioLoading = false;
  protected audioError = '';
  protected audioUrl = '';

  // Avatar state
  protected avatarResult: AvatarGenerationResponse | null = null;
  protected avatarLoading = false;
  protected avatarError = '';
  protected avatarBase64 = '';
  protected selectedImagePreview = '';

  ngOnInit(): void {
    this.petType = sessionStorage.getItem('petType') || 'dog';
    this.petName = sessionStorage.getItem('petName') || 'Buddy';
    
    // Load stored analysis result if available
    const storedAnalysis = sessionStorage.getItem('analysisResponse');
    if (storedAnalysis) {
      try {
        this.poopResult = JSON.parse(storedAnalysis);
      } catch (e) {
        console.error('Failed to parse stored analysis:', e);
      }
    }
  }

  protected selectTab(tab: TabType): void {
    this.activeTab = tab;
  }

  // Poop Analysis
  protected analyzePoopData(): void {
    this.poopLoading = true;
    this.poopError = '';

    const consistency = sessionStorage.getItem('poopConsistency') || 'firm';
    const color = sessionStorage.getItem('poopColor') || 'brown';

    const requestData = {
      petName: this.petName,
      petType: this.petType,
      foodType: 'pedigree',
      consistency,
      color
    };

    console.log('Calling poop API with:', requestData);

    this.poopService.analyzePoopData(requestData).subscribe({
      next: (response) => {
        this.poopLoading = false;
        this.poopResult = response;
        sessionStorage.setItem('analysisResponse', JSON.stringify(response));
        console.log('Poop API response:', response);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.poopLoading = false;
        this.poopError = `Failed to analyze: ${error.message || 'Unknown error'}`;
        console.error('Poop analysis error:', error);
        this.cdr.markForCheck();
      }
    });
  }

  // Pet Audio
  protected fetchRandomAudio(): void {
    this.audioLoading = true;
    this.audioError = '';
    this.audioUrl = '';

    this.audioService.getRandomAudio(this.petType).subscribe({
      next: (response) => {
        this.audioLoading = false;
        this.audioResult = response;
        this.audioUrl = response.audioUrl || '';
        console.log('Audio response:', response, 'URL:', this.audioUrl);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.audioLoading = false;
        this.audioError = 'Failed to fetch audio. Please try again.';
        console.error('Audio fetch error:', error);
        this.cdr.markForCheck();
      }
    });
  }

  // Avatar Generation
  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      this.selectedImagePreview = result;
      // Extract base64 without the data URL prefix
      const base64 = result.split(',')[1];
      this.generateAvatar(base64);
    };

    reader.readAsDataURL(file);
  }

  private generateAvatar(imageBase64: string): void {
    this.avatarLoading = true;
    this.avatarError = '';
    this.avatarBase64 = '';

    this.avatarService.generateAvatar(imageBase64).subscribe({
      next: (response) => {
        this.avatarLoading = false;
        this.avatarResult = response;
        this.avatarBase64 = response.avatar_base64 || '';
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.avatarLoading = false;
        const errorMsg = error.error?.message || error.message || 'Unknown error';
        this.avatarError = `Failed to generate avatar: ${errorMsg}`;
        console.error('Avatar generation error:', error);
        this.cdr.markForCheck();
      }
    });
  }

  protected formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }
}
