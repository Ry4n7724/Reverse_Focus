import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { TUI_DARK_MODE, TuiRoot } from "@taiga-ui/core";
import { BottomNavigation } from "./bottom-navigation/bottom-navigation";
import { Navbar } from "./navbar/navbar";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, Navbar, BottomNavigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  protected readonly darkMode = inject(TUI_DARK_MODE);
  protected readonly isBlocker = signal(false);
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

    this.updateLayout(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateLayout(event.urlAfterRedirects);
      if (event.urlAfterRedirects !== '/blocker') {
        localStorage.setItem(this.STORAGE_KEY, event.urlAfterRedirects);
      }
    });
  }

  private updateLayout(url: string) {
    const blocker = url.startsWith('/blocker');
    this.isBlocker.set(blocker);
    document.body.classList.toggle('popup', !blocker);
  }
}
