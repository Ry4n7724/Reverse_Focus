import { Component, inject, OnInit, signal } from "@angular/core";
import { Quote, QuotesService } from "../quotes-service/quotes-service";

@Component({
  selector: "app-website-blocker",
  imports: [],
  templateUrl: "./website-blocker.html",
  styleUrl: "./website-blocker.css",
})
export class WebsiteBlocker implements OnInit {
  quote = signal<Quote | null>(null);
  quoteService = inject(QuotesService);
  blockedUrl: string | null = null;
  showTitle = signal(false);
  showQuote = signal(false);
  showSearchMode = signal(false);

  async ngOnInit() {
    this.startRevealSequence();
    const quote = (await this.quoteService.getQuote())[0];
    this.quote.set(quote);
    chrome.storage.local.get("blockedUrl", (result: any) => {
      this.blockedUrl = result.blockedUrl;
    });
  }

  navigateForward() {
    if (this.blockedUrl) {
      window.location.href = this.blockedUrl;
      chrome.storage.local.remove("blockedUrl");
    }
  }

  startSearchMode(time: number) {
    const endTime = Date.now() + time * 60 * 1000;
    chrome.storage.local.set({
      searchModeEnd: endTime,
    });
    this.navigateForward();
  }

  startRevealSequence(): void {
    this.showTitle.set(true);
    setTimeout(() => this.showQuote.set(true), 1000);
    setTimeout(() => this.showSearchMode.set(true), 5000);
  }
}
