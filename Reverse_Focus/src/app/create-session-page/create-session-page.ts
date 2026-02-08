import { Component } from '@angular/core';
import { TemplateForm } from "../template-form/template-form";
import { FieldConfig } from '../template-form/field-config';
import { Form, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-session-page',
  imports: [TemplateForm],
  templateUrl: './create-session-page.html',
  styleUrl: './create-session-page.css',
})
export class CreateSessionPage {

  formTitle = 'Create Session';
  fields: FieldConfig[] = [
    {
      name: 'name', label: 'Session Name', type: 'inputWithIconPicker',
      subInputs: [{ name: 'icon', label: 'Session Icon', type: 'icon-picker' }]
    },
    { name: 'url', label: 'Add URL', type: 'textfield' }
  ]

  saveSession = (form: FormGroup) => {
    console.log(form.value)
  }

}
