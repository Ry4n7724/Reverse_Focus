import { Component, inject, OnInit, signal } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { LucideAngularModule } from 'lucide-angular';
import Session from '../session-database/session';
import { SessionService } from '../session-database/session-service';
import { SessionEditor } from '../session-editor/session-editor';
import { ConfirmService } from '../shared/confirm';

@Component({
  selector: 'app-create-session-page',
  imports: [SessionEditor, TuiButton, LucideAngularModule],
  templateUrl: './create-session-page.html',
  styleUrl: './create-session-page.css',
})
export class CreateSessionPage implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly confirm = inject(ConfirmService);

  readonly sessions = signal<Session[]>([]);
  readonly expandedId = signal<number | null>(null);
  /** `null` = list view, `'new'` = creating, otherwise the session being edited. */
  readonly editing = signal<Session | 'new' | null>(
    localStorage.getItem('sessionFormState') ? 'new' : null);

  ngOnInit() {
    this.loadSessions();
  }

  async loadSessions() {
    this.sessions.set(await this.sessionService.getSessions());
  }

  editedSession(): Session | null {
    const value = this.editing();
    return value && value !== 'new' ? value : null;
  }

  toggleExpanded(id: number) {
    this.expandedId.update(current => (current === id ? null : id));
  }

  async onSaved() {
    this.editing.set(null);
    await this.loadSessions();
  }

  async deleteSession(session: Session) {
    const ok = await this.confirm.ask(
      'Delete session?',
      `"${session.sessionName}" and its allowed websites will be removed.`,
      'Delete');
    if (!ok) {
      return;
    }
    await this.sessionService.deleteSession(session.id);
    await this.loadSessions();
  }
}
