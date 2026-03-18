import { Component, inject } from '@angular/core';
import { TemplateForm } from "../template-form/template-form";
import { FieldConfig } from '../template-form/field-config';
import { Form, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../session-database/session-service';
import { emptyListValidator } from '../template-form/emptyListValidator';

@Component({
  selector: 'app-create-session-page',
  imports: [TemplateForm],
  templateUrl: './create-session-page.html',
  styleUrl: './create-session-page.css',
})
export class CreateSessionPage {

  sessionService = inject(SessionService)
  formTitle = 'Create Session';
  fields: FieldConfig[] = [
    {
      name: 'sessionName', label: 'Session Name', type: 'inputWithIconPicker', validator: Validators.required,
      subInputs: [{ name: 'icon', label: 'Session Icon', type: 'icon-picker', value: 'book' }]
    },
    { name: 'urlList', label: 'Add URLs', type: 'urlsInput', value: [], placeholder: 'url1,url2,...' },
  ]

  saveSession = (form: FormGroup) => {
    if (form.valid) {
      console.log(form.value)
      this.sessionService.addSession(form.value.sessionName, form.value.icon, form.value.url, false)
      form.reset()
    }
  }
}
