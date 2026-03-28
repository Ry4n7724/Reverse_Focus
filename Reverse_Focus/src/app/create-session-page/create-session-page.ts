import { Component, inject, OnInit, signal, effect, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { TemplateForm } from "../template-form/template-form";
import { FieldConfig } from '../template-form/field-config';
import { FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../session-database/session-service';
import { SessionDropdown } from "../session-dropdown/session-dropdown";
import Session from '../session-database/session';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-session-page',
  imports: [TemplateForm, SessionDropdown],
  templateUrl: './create-session-page.html',
  styleUrl: './create-session-page.css',
})
export class CreateSessionPage implements OnInit, AfterViewInit, OnDestroy {
  mode: Mode = Mode.CREATE;
  sessionService = inject(SessionService)
  formTitle = 'Create Session';
  defaultFields: FieldConfig[] = [
    {
      name: 'sessionName', label: 'Session Name', type: 'inputWithIconPicker', validator: Validators.required,
      subInputs: [{ name: 'icon', label: 'Session Icon', type: 'icon-picker', value: 'book' }]
    },
    { name: 'urlList', label: 'Add URLs', type: 'urlsInput', value: [], placeholder: 'url1,url2,...' },
  ];
  fields = signal<FieldConfig[]>(this.defaultFields);
  sessions = signal<Session[]>([]);
  @ViewChild(TemplateForm) templateForm?: TemplateForm;
  editingSessionId?: number;
  private readonly STORAGE_KEY = 'sessionFormState';
  private formSubscription?: Subscription;

  private saveToStorage(form: FormGroup) {
    const state = {
      sessionName: form.value.sessionName || '',
      icon: form.value.icon || 'book',
      urlList: form.value.urlList || []
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  private clearStorage() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private loadFromStorage(): { sessionName: string; icon: string; urlList: string[] } | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  private setupFormSubscription(form: FormGroup) {
    this.formSubscription?.unsubscribe();
    this.formSubscription = form.valueChanges.subscribe(() => {
      if (this.mode === Mode.CREATE) {
        this.saveToStorage(form);
      }
    });
  }

  ngOnDestroy() {
    this.formSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.templateForm) {
      this.setupFormSubscription(this.templateForm.form);
    }
  }

  constructor() {
    effect(() => {
      const currentFields = this.fields();
      if (this.templateForm && this.mode === Mode.EDIT) {
        this.templateForm.form.patchValue({
          sessionName: currentFields[0]?.value,
          icon: currentFields[0]?.subInputs?.[0]?.value,
          urlList: currentFields[1]?.value
        }, { emitEvent: false });
        this.templateForm.urlInputControl.clearValidators();
      }
    });
  }

  saveSession = (form: FormGroup) => {
    if (this.mode === Mode.EDIT && form.valid) {
      this.sessionService.updateSession(this.editingSessionId!, {
        sessionName: form.value.sessionName,
        icon: form.value.icon,
        urls: form.value.urlList
      });
      this.mode = Mode.CREATE;
      this.formTitle = 'Create Session';
      this.fields.set(this.defaultFields);
      this.loadSessions();
      this.clearStorage();
    } else if (form.valid) {
      console.log(form.value)
      this.sessionService.addSession(form.value.sessionName, form.value.icon, form.value.urlList, false)
      form.reset()
      this.loadSessions();
      this.clearStorage();
    }
  }

  async ngOnInit() {
    this.loadSessions();
    const saved = this.loadFromStorage();
    if (saved && this.mode === Mode.CREATE) {
      this.fields.set([
        {
          name: 'sessionName', label: 'Session Name', type: 'inputWithIconPicker', validator: Validators.required,
          value: saved.sessionName,
          subInputs: [{ name: 'icon', label: 'Session Icon', type: 'icon-picker', value: saved.icon }]
        },
        { name: 'urlList', label: 'Add URLs', type: 'urlsInput', value: saved.urlList, placeholder: 'url1,url2,...' },
      ]);
    }
  }

  async loadSessions() {
    this.sessions.set(await this.sessionService.getSessions());
  }

  editSession($event: Session) {
    this.mode = Mode.EDIT;
    this.editingSessionId = $event.id;
    this.formTitle = 'Edit Session';
    this.clearStorage();
    this.fields.set([
      {
        name: 'sessionName', label: 'Session Name', type: 'inputWithIconPicker', validator: Validators.required,
        value: $event.sessionName,
        subInputs: [{ name: 'icon', label: 'Session Icon', type: 'icon-picker', value: $event.icon }]
      },
      { name: 'urlList', label: 'Add URLs', type: 'urlsInput', value: $event.urls, placeholder: 'url1,url2,...' },
    ]);
  }

  deleteSession($event: Session) {
    this.sessionService.deleteSession($event.id);
    this.loadSessions();
  }
}

enum Mode {
  CREATE = 'create',
  EDIT = 'edit'
}
