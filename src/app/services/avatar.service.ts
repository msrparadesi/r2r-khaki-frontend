import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';

export interface AvatarGenerationRequest {
  image_base64: string;
}

export interface AvatarGenerationResponse {
  avatar_base64?: string;
  status?: string;
  message?: string;
  error?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  // Using API Gateway endpoint (has CORS configured, 29s timeout)
  private readonly apiUrl = 'https://hzdaeslqvk.execute-api.us-east-1.amazonaws.com/prod/generate';

  constructor(private readonly http: HttpClient) {}

  generateAvatar(imageBase64: string): Observable<AvatarGenerationResponse> {
    return this.http.post<AvatarGenerationResponse>(this.apiUrl, {
      image_base64: imageBase64
    }).pipe(
      timeout(120000), // 2 minute timeout for image processing
      catchError(error => {
        console.error('Avatar API error:', error);
        return throwError(() => error);
      })
    );
  }
}
