import { Component, input, Output, EventEmitter, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { TuiChevron } from '@taiga-ui/kit';
import Session from '../session-database/session';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-session-dropdown',
  imports: [ReactiveFormsModule, TuiButton, TuiChevron, TuiDataList, TuiDropdown, LucideAngularModule],
  templateUrl: './session-dropdown.html',
  styleUrl: './session-dropdown.css',
})
export class SessionDropdown {
  session = input.required<Session>();
  editSession = output<Session>();
  protected open = false;

  onEditClick(event: Event): void {
    event.stopPropagation();
    this.editSession.emit(this.session());
  }
}
