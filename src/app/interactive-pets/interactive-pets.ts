import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pet {
  type: 'dog' | 'cat' | 'hamster';
  position: number;
  isMoving: boolean;
  isJumping: boolean;
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
    { type: 'dog', position: 0, isMoving: false, isJumping: false },
    { type: 'cat', position: 0, isMoving: false, isJumping: false },
    { type: 'hamster', position: 0, isMoving: false, isJumping: false }
  ];

  private animationInterval: any;

  ngOnInit(): void {
    this.startSynchronizedAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private startSynchronizedAnimation(): void {
    this.animationInterval = setInterval(() => {
      // Reset all pets
      this.pets.forEach(pet => {
        pet.position = 0;
        pet.isMoving = true;
        pet.isJumping = false;
      });

      // Move phase: 10 seconds
      const moveInterval = setInterval(() => {
        this.pets.forEach(pet => {
          if (pet.position < 85) {
            pet.position += 0.85; // 85% in 10 seconds = 0.85% per 100ms
          }
        });
      }, 100);

      // After 10 seconds, stop moving and start jumping
      setTimeout(() => {
        clearInterval(moveInterval);
        this.pets.forEach(pet => {
          pet.isMoving = false;
          pet.isJumping = true;
        });

        // After 5 more seconds, reset
        setTimeout(() => {
          this.pets.forEach(pet => {
            pet.isJumping = false;
          });
        }, 5000);
      }, 10000);
    }, 15000); // Total cycle: 15 seconds
  }
}
