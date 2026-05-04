import { NgClass } from "@angular/common";
import { Component, inject, OnInit, signal } from '@angular/core';
import { TuiChip } from "@taiga-ui/kit";
import { LucideAngularModule } from "lucide-angular";
import Session from '../session-database/session';
import { SessionService } from '../session-database/session-service';
import { CountdownComponent } from "../countdown-component/countdown-component";

@Component({
  selector: 'app-study-sessions',
  imports: [TuiChip, NgClass, LucideAngularModule, CountdownComponent],
  templateUrl: './study-sessions.html',
  styleUrl: './study-sessions.css',
})
export class StudySessions implements OnInit {


  sessioSevice = inject(SessionService)
  sessions = signal<Session[]>([]);
  searchModeEnd!: number;

  async ngOnInit() {
    this.loadSessions()
    chrome.storage.local.get('searchModeEnd', (result: any) => {
      this.searchModeEnd = result.searchModeEnd;
    });

  }

  async loadSessions() {
    this.sessions.set(await this.sessioSevice.getSessions())
  }

  toggleSession(id: number, active: boolean) {
    this.sessioSevice.updateSession(id, { active: !active })
    this.loadSessions()
  }

  searchModeModeActive() {
    return this.searchModeEnd !== null && Date.now() < this.searchModeEnd;
  }
}
