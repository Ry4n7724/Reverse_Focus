import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { TUI_DARK_MODE, TuiRoot } from "@taiga-ui/core";
import { BottomNavigation } from "./bottom-navigation/bottom-navigation";
import { Navbar } from "./navbar/navbar";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, Navbar, BottomNavigation, BottomNavigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  protected readonly darkMode = inject(TUI_DARK_MODE);
  private readonly STORAGE_KEY = 'currentRoute';

  constructor(private router: Router) { }

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const route = params.get('route');
    const currentHash = window.location.hash.replace('#', '');

    if (route) {
      this.router.navigateByUrl(route);
      localStorage.setItem(this.STORAGE_KEY, route);
    } else if (currentHash && currentHash !== '/') {
      this.router.navigateByUrl(currentHash);
    } else {
      const savedRoute = localStorage.getItem(this.STORAGE_KEY);
      if (savedRoute && savedRoute !== '/blocker') {
        this.router.navigateByUrl(savedRoute);
      }
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.urlAfterRedirects !== '/blocker') {
        localStorage.setItem(this.STORAGE_KEY, event.urlAfterRedirects);
      }
    });
  }
}
