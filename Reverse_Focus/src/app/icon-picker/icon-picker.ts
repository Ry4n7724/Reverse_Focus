import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDataListComponent, TuiDropdown } from "@taiga-ui/core";
import { icons, LucideAngularModule } from 'lucide-angular';


@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.html',
  styleUrls: ['./icon-picker.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiDropdown,
    TuiDataListComponent,
    LucideAngularModule
  ],
})
export class IconPicker {
  icon = 'book';
  iconList: string[] = Object.keys(icons);
  open = signal(false);

  selectIcon(icon: string) {
    this.icon = icon;
  }

  onClick(): void {
    this.open.update((open) => !open);
  }

}