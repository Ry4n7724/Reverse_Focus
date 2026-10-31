import { Component, inject } from '@angular/core';
import { TUI_DARK_MODE, TuiButton, TuiIcon } from "@taiga-ui/core";

@Component({
  selector: 'app-navbar',
  imports: [TuiIcon, TuiButton],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
