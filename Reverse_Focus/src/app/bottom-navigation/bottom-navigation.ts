import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TuiIcon } from "@taiga-ui/core";
import { filter } from 'rxjs';

@Component({
  selector: 'app-bottom-navigation',
  imports: [TuiIcon, RouterLink, RouterLinkActive],
  templateUrl: './bottom-navigation.html',
  styleUrl: './bottom-navigation.css',
})
export class BottomNavigation {
  private readonly router = inject(Router);
  // The Focus tab covers both the starter page and the dashboard.
  protected readonly focusActive = signal(this.isFocusUrl(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => this.focusActive.set(this.isFocusUrl((e as NavigationEnd).urlAfterRedirects)));
  }

  private isFocusUrl(url: string): boolean {
    return url === '/' || url.startsWith('/dashboard');
  }
}
