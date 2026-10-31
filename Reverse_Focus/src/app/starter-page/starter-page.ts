import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { LucideAngularModule } from 'lucide-angular';
import { CountdownComponent } from '../countdown-component/countdown-component';
import Session from '../session-database/session';
import { SessionService } from '../session-database/session-service';
import { Todo } from '../todo/todo';

@Component({
  selector: 'app-starter-page',
  imports: [Todo, CountdownComponent, TuiButton, LucideAngularModule, RouterLink],
  templateUrl: './starter-page.html',
  styleUrl: './starter-page.css'
})
export class StarterPage implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  readonly sessions = signal<Session[]>([]);
  readonly loaded = signal(false);
  readonly searchModeEnd = signal(0);

  async ngOnInit() {
    this.sessions.set(await this.sessionService.getSessions());
    this.loaded.set(true);
    chrome.storage.local.get('searchModeEnd', (result: any) => {
      this.searchModeEnd.set(result.searchModeEnd ?? 0);
    });
  }

  searchModeActive(): boolean {
    return Date.now() < this.searchModeEnd();
  }

  endSearchMode() {
    chrome.storage.local.remove(['searchMode', 'searchModeEnd']);
    this.searchModeEnd.set(0);
  }

  async start(session: Session) {
    await this.sessionService.updateSession(session.id, { active: true });
    await this.router.navigate(['/dashboard'], { replaceUrl: true });
  }
}
