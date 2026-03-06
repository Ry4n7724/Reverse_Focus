import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-website-blocker',
  imports: [],
  templateUrl: './website-blocker.html',
  styleUrl: './website-blocker.css',
})
export class WebsiteBlocker implements OnInit {

  quote = signal('');

  ngOnInit() {

  }

}
