import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDataListComponent, TuiDropdown } from "@taiga-ui/core";
import { icons, LucideAngularModule } from 'lucide-angular';
import { TuiChevron } from "@taiga-ui/kit";


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
    LucideAngularModule,
    TuiChevron
  ],
})
export class IconPicker implements ControlValueAccessor {
  iconValue = model.required<string>();
  iconList: string[] = Object.keys(icons);
  open = signal(false);
  onChange: any = () => { };
  onTouched: any = () => { };

  selectIcon(newIcon: string) {
    this.iconValue.set(newIcon);
    this.onChange(newIcon);
    this.onTouched();
  }

  writeValue(obj: any): void {
    this.iconValue.set(obj)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}