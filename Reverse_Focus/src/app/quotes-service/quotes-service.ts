import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Quote } from 'lucide-angular';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {

  http = inject(HttpClient);

  getQuote() {
    return firstValueFrom(this.http.get<Quote[]>('https://zenquotes.io/api/random'));
  }

}

export interface Quote {
  q: string;
  a: string;
  h: string;
} 