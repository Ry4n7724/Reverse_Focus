import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiIcon, TuiError, TuiTextfieldComponent, TuiTextfield, TuiButton } from "@taiga-ui/core";
import { TuiChip, TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { FieldConfig } from './field-config'
import { IconPicker } from '../icon-picker/icon-picker';

@Component({
  selector: 'app-template-form',
  imports: [TuiIcon, TuiError, TuiTextfieldComponent, ReactiveFormsModule, TuiFieldErrorPipe, CommonModule, TuiTextfield, IconPicker, TuiChip, TuiButton],
  providers: [
    tuiValidationErrorsProvider({
      required: 'Value is required',
    })
  ],
  templateUrl: './template-form.html',
  styleUrl: './template-form.css',
})
export class TemplateForm implements OnInit {
  formTitle = input.required<string>()
  fields = input.required<FieldConfig[]>()
  methode = input.required<(form: FormGroup) => void>()
  form = new FormGroup({});
  urlInputControl = new FormControl('', [
    Validators.required,
  ]);


  ngOnInit() {
    this.form.addControl("urlInputControl", this.urlInputControl);
    for (let field of this.fields()) {
      this.form.addControl(field.name, new FormControl(field.value, field.validator))
      if (field.subInputs) {
        for (let subInput of field.subInputs) {
          this.form.addControl(subInput.name, new FormControl(subInput.value ?? '', subInput.validator))
        }
      }
    }
  }

  addUrl(fieldName: string, url: string) {
    const urls = url.split(',').map(u => u.trim());
    for (let url of urls) {
      const control = this.form.get(fieldName)
      if (control) {
        const current: string[] = control.value || []
        if (!current.includes(url)) {
          control.setValue([...current, url])
        }
      }
    }
  }

  removeUrl(fieldName: string, url: string) {
    const control = this.form.get(fieldName)
    if (control) {
      const current: string[] = control.value || []
      control.setValue(current.filter((u: string) => u !== url))
    }
  }
}
