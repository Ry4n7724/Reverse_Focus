import { Component, inject } from '@angular/core';
import { TUI_DARK_MODE, TUI_DARK_MODE_KEY, TuiIcon } from "@taiga-ui/core";

@Component({
  selector: 'app-navbar',
  imports: [TuiIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
