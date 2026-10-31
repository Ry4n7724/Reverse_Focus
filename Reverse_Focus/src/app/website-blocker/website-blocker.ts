import { Component, inject, OnInit, signal } from "@angular/core";
import { TuiButton, TuiIcon } from "@taiga-ui/core";
import { Quote, QuotesService } from "../quotes-service/quotes-service";
import { SessionService } from "../session-database/session-service";

const FALLBACK_QUOTE: Quote = {
  q: "The successful warrior is the average man, with laser-like focus.",
  a: "Bruce Lee",
  h: "",
};

@Component({
  selector: "app-website-blocker",
  imports: [TuiButton, TuiIcon],
  templateUrl: "./website-blocker.html",
  styleUrl: "./website-blocker.css",
})
export class WebsiteBlocker implements OnInit {
  private readonly quoteService = inject(QuotesService);
  private readonly sessionService = inject(SessionService);

  readonly durations = [5, 10, 15, 20];

  quote = signal<Quote | null>(null);
  blockedUrl = signal<string | null>(null);
  sessionName = signal<string>("");
  showSearchOptions = signal(false);
  selectedMinutes = signal(5);

  async ngOnInit() {
    chrome.storage.local.get("blockedUrl", (result: any) => {
      this.blockedUrl.set(result.blockedUrl ?? null);
    });
    const active = (await this.sessionService.getSessions()).filter(s => s.active);
    this.sessionName.set(active.map(s => s.sessionName).join(", "));
    try {
      this.quote.set((await this.quoteService.getQuote())[0] ?? FALLBACK_QUOTE);
    } catch {
      this.quote.set(FALLBACK_QUOTE);
    }
  }

  blockedDomain(): string {
    const url = this.blockedUrl();
    if (!url) {
      return "This page";
    }
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  backToFocus() {
    // Close the blocked tab; `window.close()` is the fallback for contexts without tab access.
    chrome.tabs.getCurrent(tab => {
      if (tab?.id !== undefined) {
        chrome.tabs.remove(tab.id);
      } else {
        window.close();
      }
    });
  }

  startSearchMode() {
    const endTime = Date.now() + this.selectedMinutes() * 60 * 1000;
    chrome.storage.local.set({ searchModeEnd: endTime }, () => this.navigateForward());
  }

  private navigateForward() {
    const url = this.blockedUrl();
    if (url) {
      chrome.storage.local.remove("blockedUrl");
      window.location.href = url;
    }
  }
}
