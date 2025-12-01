import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PetAudioResponse {
  bucket?: string;
  key?: string;
  filename?: string;
  audioUrl?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class PetAudioService {
  private readonly apiUrl = 'https://gepyjeggfd.execute-api.us-east-1.amazonaws.com/prod/audio/random';

  constructor(private readonly http: HttpClient) {}

  getRandomAudio(animal: string = 'dog'): Observable<PetAudioResponse> {
    return this.http.get<PetAudioResponse>(`${this.apiUrl}?animal=${animal}`).pipe(
      map(response => {
        // Construct S3 URL from bucket and key
        if (response.bucket && response.key) {
          response.audioUrl = `https://${response.bucket}.s3.amazonaws.com/${response.key}`;
        }
        return response;
      })
    );
  }
}
