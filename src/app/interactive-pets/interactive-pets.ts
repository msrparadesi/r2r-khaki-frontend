import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pet {
  type: 'dog' | 'cat' | 'hamster';
  emoji: string;
  position: number;
  isMoving: boolean;
  isGreeting: boolean;
}

@Component({
  selector: 'app-interactive-pets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive-pets.html',
  styleUrls: ['./interactive-pets.sass']
})
export class InteractivePetsComponent implements OnInit, OnDestroy {
  pets: Pet[] = [
    { type: 'dog', emoji: '🐕', position: 0, isMoving: false, isGreeting: false },
    { type: 'cat', emoji: '🐈', position: 0, isMoving: false, isGreeting: false },
    { type: 'hamster', emoji: '🐹', position: 0, isMoving: false, isGreeting: false }
  ];

  private intervals: any[] = [];

  ngOnInit(): void {
    this.pets.forEach((pet, index) => {
      setTimeout(() => {
        this.startPetAnimation(pet);
      }, index * 3000);
    });
  }

  ngOnDestroy(): void {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  private startPetAnimation(pet: Pet): void {
    const moveInterval = setInterval(() => {
      pet.isMoving = true;
      pet.isGreeting = false;
      
      const moveAnimation = setInterval(() => {
        if (pet.position < 85) {
          pet.position += 1;
        }
      }, 100);

      setTimeout(() => {
        clearInterval(moveAnimation);
        pet.isMoving = false;
        pet.isGreeting = true;

        setTimeout(() => {
          pet.position = 0;
          pet.isGreeting = false;
        }, 5000);
      }, 10000);
    }, 15000);

    this.intervals.push(moveInterval);
  }
}
