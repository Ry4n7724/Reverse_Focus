import { Component, OnInit } from '@angular/core';
import { TuiChip } from "@taiga-ui/kit";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-study-sessions',
  imports: [TuiChip, NgClass],
  templateUrl: './study-sessions.html',
  styleUrl: './study-sessions.css',
})
export class StudySessions implements OnInit {

  activateSession(id: number) {
    const index = this.sessions.findIndex(session => session.id === id);
    if (index !== -1) {
      this.sessions[index].active = !this.sessions[index].active;
    }
  }

  sessions = [
    { id: 1, name: 'Math', active: true },
    { id: 2, name: 'History', active: false },
    { id: 3, name: 'Biology ', active: false },
    { id: 4, name: 'Physics', active: false },
    { id: 5, name: 'Chemistry ', active: false },
  ];

  ngOnInit() {

  }
}
