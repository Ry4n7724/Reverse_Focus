import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDataListComponent, TuiDropdown, TuiIcon } from "@taiga-ui/core";
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
    TuiChevron,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconPicker),
      multi: true
    }
  ]
})
export class IconPicker implements ControlValueAccessor {
  iconValue = signal<string | null>(null);
  iconList: string[] = Object.keys(icons);
  open = signal(false);

  private onChange = (newIcon: string) => { };
  private onTouched = () => { };

  selectIcon(newIcon: string) {
    this.iconValue.set(newIcon);
    this.onChange(newIcon);
    this.onTouched();
    this.open.set(false)
  }

  writeValue(newIcon: string): void {
    this.iconValue.set(newIcon)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}