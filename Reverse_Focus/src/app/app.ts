import { TuiRoot } from "@taiga-ui/core";
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { TUI_DARK_MODE, TUI_DARK_MODE_KEY } from '@taiga-ui/core';
import { BottomNavigation } from "./bottom-navigation/bottom-navigation";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, Navbar, BottomNavigation, BottomNavigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
