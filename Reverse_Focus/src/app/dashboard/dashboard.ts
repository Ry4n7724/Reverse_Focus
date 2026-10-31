import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { LucideAngularModule } from "lucide-angular";
import { CountdownComponent } from '../countdown-component/countdown-component';
import Session from '../session-database/session';
import { SessionService } from '../session-database/session-service';
import { ConfirmService } from '../shared/confirm';
import { Todo } from '../todo/todo';

interface UnblockedSite {
  url: string;
  domain: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, TuiButton, TuiBadge, Todo, CountdownComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly confirm = inject(ConfirmService);

  unblockedSites = signal<UnblockedSite[]>([]);
  activeSessions = signal<Session[]>([]);
  readonly searchModeEnd = signal(0);

  searchModeActive(): boolean {
    return Date.now() < this.searchModeEnd();
  }

  endSearchMode() {
    chrome.storage.local.remove(['searchMode', 'searchModeEnd']);
    this.searchModeEnd.set(0);
  }

  async ngOnInit() {
    chrome.storage.local.get('searchModeEnd', (result: any) => {
      this.searchModeEnd.set(result.searchModeEnd ?? 0);
    });
    const sessions = await this.sessionService.getSessions();
    const active = sessions.filter(s => s.active);
    this.activeSessions.set(active);
    const uniqueUrls = [...new Set(active.flatMap(s => s.urls))];
    this.unblockedSites.set(uniqueUrls.map(url => ({
      url,
      domain: this.extractDomain(url)
    })));
  }

  sessionTitle(): string {
    return this.activeSessions().map(s => s.sessionName).join(' + ');
  }

  extractDomain(url: string): string {
    try {
      return new URL(this.withProtocol(url)).hostname;
    } catch {
      return url;
    }
  }

  /** Allowed entries are stored without a protocol, so links need one to open. */
  withProtocol(url: string): string {
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`;
  }

  faviconUrl(domain: string): string {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }

  async unfocus() {
    const ok = await this.confirm.ask(
      'End focus session?',
      'Blocking stops and all websites become accessible again.',
      'End session');
    if (!ok) {
      return;
    }
    for (const session of this.activeSessions()) {
      await this.sessionService.updateSession(session.id, { active: false });
    }
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
