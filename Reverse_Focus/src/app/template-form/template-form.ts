import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiIcon, TuiError, TuiTextfieldComponent, TuiTextfield } from "@taiga-ui/core";
import { TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { FieldConfig } from './field-config'

@Component({
  selector: 'app-template-form',
  imports: [TuiIcon, TuiError, TuiTextfieldComponent, ReactiveFormsModule, TuiFieldErrorPipe, CommonModule, TuiTextfield],
  providers: [
    tuiValidationErrorsProvider({
      required: 'Value is required'
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
  console: any;

  ngOnInit() {
    for (let field of this.fields()) {
      this.form.addControl(field.name, new FormControl(field.value ?? '', field.validator))
    }

  }
}
