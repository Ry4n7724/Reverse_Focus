import { ChangeDetectionStrategy, Component, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TuiButton, TuiDropdown, TuiTextfield } from "@taiga-ui/core";
import { icons, LucideAngularModule } from 'lucide-angular';

const MAX_RESULTS = 60;

// `icons` also exports aliases ("BookIcon", "LucideBook"); keep only the canonical names.
const ALL_ICONS: { name: string; search: string }[] = Object.keys(icons)
  .filter(key => !key.endsWith('Icon') && !key.startsWith('Lucide'))
  .map(key => {
    const name = toKebab(key);
    return { name, search: name.replace(/-/g, ' ') };
  });

function toKebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Za-z])([0-9])/g, '$1-$2').toLowerCase();
}

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.html',
  styleUrls: ['./icon-picker.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TuiButton, TuiDropdown, TuiTextfield, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconPicker),
      multi: true
    }
  ]
})
export class IconPicker implements ControlValueAccessor {
  protected readonly iconValue = signal<string | null>(null);
  protected readonly open = signal(false);
  protected readonly query = signal('');

  protected readonly results = computed(() => {
    const q = this.query().trim().toLowerCase().replace(/-/g, ' ');
    const matches = q ? ALL_ICONS.filter(i => i.search.includes(q)) : ALL_ICONS;
    return {
      shown: matches.slice(0, MAX_RESULTS).map(i => i.name),
      total: matches.length,
    };
  });

  private onChange = (_: string) => { };
  private onTouched = () => { };

  protected selectIcon(newIcon: string) {
    this.iconValue.set(newIcon);
    this.onChange(newIcon);
    this.onTouched();
    this.open.set(false);
    this.query.set('');
  }

  writeValue(newIcon: string): void {
    this.iconValue.set(newIcon);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
