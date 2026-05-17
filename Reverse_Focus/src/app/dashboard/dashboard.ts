import { Component, inject, OnInit, signal } from '@angular/core';
import { SessionService } from '../session-database/session-service';
import { LucideAngularModule } from "lucide-angular";
import session from '../session-database/session';
import { Router } from '@angular/router';
import { TuiButton } from "@taiga-ui/core";

interface UnblockedSite {
  url: string;
  domain: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, TuiButton],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  router = inject(Router);
  sessionService = inject(SessionService);
  unblockedSites = signal<UnblockedSite[]>([]);
  activeSessions: session[] = [];

  async ngOnInit() {
    const sessions = await this.sessionService.getSessions();
    this.activeSessions = sessions.filter(s => s.active);
    const urls = this.activeSessions.flatMap(s => s.urls);
    const uniqueUrls = [...new Set(urls)];
    this.unblockedSites.set(uniqueUrls.map(url => ({
      url,
      domain: this.extractDomain(url)
    })));
  }

  extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  faviconUrl(domain: string): string {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }

  async unfocus() {
    for (let session of this.activeSessions) {
      await this.sessionService.updateSession(session.id, { active: false });
    }
    this.router.navigate(['/'], { replaceUrl: true });
  }

  async redirectIfNoActiveSession() {
    const hasActive = await this.sessionService.hasActiveSession();
    if (!hasActive) {
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }
}
