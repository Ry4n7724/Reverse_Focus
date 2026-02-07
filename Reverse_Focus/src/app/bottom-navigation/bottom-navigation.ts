import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIcon } from "@taiga-ui/core";

@Component({
  selector: 'app-bottom-navigation',
  imports: [TuiIcon, RouterLink],
  templateUrl: './bottom-navigation.html',
  styleUrl: './bottom-navigation.css',
})
export class BottomNavigation {

}
