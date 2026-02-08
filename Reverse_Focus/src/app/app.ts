import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TUI_DARK_MODE, TuiRoot } from "@taiga-ui/core";
import { BottomNavigation } from "./bottom-navigation/bottom-navigation";
import { Navbar } from "./navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, Navbar, BottomNavigation, BottomNavigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
