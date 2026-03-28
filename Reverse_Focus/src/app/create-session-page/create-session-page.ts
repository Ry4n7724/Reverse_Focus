import { Component, inject, OnInit, signal } from '@angular/core';
import { TemplateForm } from "../template-form/template-form";
import { FieldConfig } from '../template-form/field-config';
import { FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../session-database/session-service';
import { SessionDropdown } from "../session-dropdown/session-dropdown";
import Session from '../session-database/session';

@Component({
  selector: 'app-create-session-page',
  imports: [TemplateForm, SessionDropdown],
  templateUrl: './create-session-page.html',
  styleUrl: './create-session-page.css',
})
export class CreateSessionPage implements OnInit {
  mode: Mode = Mode.CREATE;
  sessionService = inject(SessionService)
  formTitle = 'Create Session';
  fields = signal<FieldConfig[]>([
    {
      name: 'sessionName', label: 'Session Name', type: 'inputWithIconPicker', validator: Validators.required,
      subInputs: [{ name: 'icon', label: 'Session Icon', type: 'icon-picker', value: 'book' }]
    },
    { name: 'urlList', label: 'Add URLs', type: 'urlsInput', value: [], placeholder: 'url1,url2,...' },
  ]);
  sessions = signal<Session[]>([]);

  saveSession = (form: FormGroup) => {
    if (form.valid) {
      console.log(form.value)
      this.sessionService.addSession(form.value.sessionName, form.value.icon, form.value.url, false)
      form.reset()
    }
  }

  async ngOnInit() {
    this.sessions.set(await this.sessionService.getSessions())
  }

  editSession($event: Session) {
    this.mode = Mode.EDIT;
    this.formTitle = 'Edit Session';
    this.fields.set([
      {
        name: 'sessionName', label: 'Session Name', type: 'inputWithIconPicker', validator: Validators.required,
        subInputs: [{ name: 'icon', label: 'Session Icon', type: 'icon-picker', value: $event.icon }]
      },
      { name: 'urlList', label: 'Add URLs', type: 'urlsInput', value: $event.urls, placeholder: 'url1,url2,...' },
    ]);
  }
}

enum Mode {
  CREATE = 'create',
  EDIT = 'edit'
}
