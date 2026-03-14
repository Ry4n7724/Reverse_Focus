import { Component, inject, OnInit, signal } from '@angular/core';
import { Quote, QuotesService } from '../quotes-service/quotes-service';

@Component({
  selector: 'app-website-blocker',
  imports: [],
  templateUrl: './website-blocker.html',
  styleUrl: './website-blocker.css',
})
export class WebsiteBlocker implements OnInit {

  quote = signal<Quote | null>(null);
  quoteService = inject(QuotesService);

  async ngOnInit() {
    const quote = (await this.quoteService.getQuote())[0];
    console.log('Hello World');
    console.log(quote);
    this.quote.set(quote);
  }

}
