import { inject, Injectable } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly dialogs = inject(TuiDialogService);

  /** Resolves to true when the user confirms, false otherwise. */
  ask(label: string, content: string, yes = 'Confirm'): Promise<boolean> {
    const data: TuiConfirmData = { content, yes, no: 'Cancel' };
    const result$: Observable<boolean> = this.dialogs
      .open<boolean>(TUI_CONFIRM, { label, size: 's', data })
      .pipe(map(Boolean));
    return new Promise(resolve => {
      let answer = false;
      result$.subscribe({
        next: value => (answer = value),
        complete: () => resolve(answer),
      });
    });
  }
}
