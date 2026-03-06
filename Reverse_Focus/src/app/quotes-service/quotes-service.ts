import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Quote } from 'lucide-angular';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {

  http = inject(HttpClient);

  getQuote() {
    return this.http.get<Quote>('https://api.quotable.io/quotes/random?tags=technology,famous-quotes')
  }

}

export interface Quote {
  text: string;
  author: string;
} 