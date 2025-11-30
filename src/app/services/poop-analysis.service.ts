import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PoopAnalysisRequest {
  petName: string;
  petType: string;
  foodType: string;
  consistency: string;
  color: string;
}

export interface PoopAnalysisResponse {
  analysis?: string;
  recommendations?: string[];
  healthStatus?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class PoopAnalysisService {
  private readonly apiUrl = 'https://vbdns7h3fh.execute-api.us-east-1.amazonaws.com/prod/analyze';

  constructor(private readonly http: HttpClient) {}

  analyzePoopData(data: PoopAnalysisRequest): Observable<PoopAnalysisResponse> {
    return this.http.post<PoopAnalysisResponse>(this.apiUrl, data);
  }
}
