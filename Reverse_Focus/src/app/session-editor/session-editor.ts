import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';
import { IconPicker } from '../icon-picker/icon-picker';
import Session from '../session-database/session';
import { SessionService } from '../session-database/session-service';

const DRAFT_KEY = 'sessionFormState';
const DEFAULT_ICON = 'book';

@Component({
  selector: 'app-session-editor',
  imports: [ReactiveFormsModule, TuiButton, TuiIcon, TuiTextfield, TuiChip, IconPicker],
  templateUrl: './session-editor.html',
  styleUrl: './session-editor.css',
})
export class SessionEditor implements OnInit, OnDestroy {
  private readonly sessionService = inject(SessionService);

  /** Session being edited; leave unset to create a new one. */
  session = input<Session | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  readonly form = new FormGroup({
    sessionName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(30)] }),
    icon: new FormControl(DEFAULT_ICON, { nonNullable: true }),
    urlList: new FormControl<string[]>([], { nonNullable: true }),
  });
  readonly urlInput = new FormControl('', { nonNullable: true });
  readonly saving = signal(false);

  private sub?: Subscription;

  get isEdit(): boolean {
    return !!this.session();
  }

  ngOnInit() {
    const existing = this.session();
    if (existing) {
      this.form.setValue({
        sessionName: existing.sessionName,
        icon: existing.icon,
        urlList: [...existing.urls],
      });
      return;
    }
    const draft = this.loadDraft();
    if (draft) {
      this.form.patchValue(draft);
    }
    // Keep a draft so an accidentally closed popup does not lose input.
    this.sub = this.form.valueChanges.subscribe(() =>
      localStorage.setItem(DRAFT_KEY, JSON.stringify(this.form.getRawValue())));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  addUrls() {
    const entries = this.urlInput.value
      .split(/[\s,]+/)
      .map(u => u.trim().replace(/\/+$/, ''))
      .filter(Boolean);
    if (!entries.length) {
      return;
    }
    const current = this.form.controls.urlList.value;
    const merged = [...current];
    for (const entry of entries) {
      if (!merged.includes(entry)) {
        merged.push(entry);
      }
    }
    this.form.controls.urlList.setValue(merged);
    this.urlInput.reset();
  }

  removeUrl(url: string) {
    this.form.controls.urlList.setValue(this.form.controls.urlList.value.filter(u => u !== url));
  }

  async save() {
    // Include a URL that was typed but not yet added.
    this.addUrls();
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const { sessionName, icon, urlList } = this.form.getRawValue();
    const name = sessionName.trim();
    const existing = this.session();
    try {
      if (existing) {
        await this.sessionService.updateSession(existing.id, { sessionName: name, icon, urls: urlList });
      } else {
        await this.sessionService.addSession(name, icon, urlList, false);
        localStorage.removeItem(DRAFT_KEY);
      }
    } finally {
      this.saving.set(false);
    }
    this.saved.emit();
  }

  cancel() {
    if (!this.isEdit) {
      localStorage.removeItem(DRAFT_KEY);
    }
    this.cancelled.emit();
  }

  private loadDraft(): { sessionName: string; icon: string; urlList: string[] } | null {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
