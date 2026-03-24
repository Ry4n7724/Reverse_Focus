import { Component, input } from '@angular/core';
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
  protected open = false;
}
