import { NgClass } from "@angular/common";
import { Component, inject, OnInit, signal } from '@angular/core';
import { TuiChip } from "@taiga-ui/kit";
import { LucideAngularModule } from "lucide-angular";
import Session from '../session-database/session';
import { SessionService } from '../session-database/session-service';

@Component({
  selector: 'app-study-sessions',
  imports: [TuiChip, NgClass, LucideAngularModule],
  templateUrl: './study-sessions.html',
  styleUrl: './study-sessions.css',
})
export class StudySessions implements OnInit {

  sessioSevice = inject(SessionService)
  sessions = signal<Session[]>([]);

  async ngOnInit() {
    this.loadSessions()
  }

  async loadSessions() {
    this.sessions.set(await this.sessioSevice.getSessions())
  }

  toggleSession(id: number, active: boolean) {
    this.sessioSevice.updateSession(id, { active: !active })
    this.loadSessions()
  }
}
