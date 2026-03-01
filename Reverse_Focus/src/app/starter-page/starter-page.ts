import { Component } from '@angular/core';
import { StudySessions } from "../study-sessions/study-sessions";
import { Todo } from "../todo/todo";

@Component({
  selector: 'app-starter-page',
  imports: [StudySessions, Todo],
  templateUrl: './starter-page.html',
  styleUrl: './starter-page.css'
})
export class StarterPage {

}
