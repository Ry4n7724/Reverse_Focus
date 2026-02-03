import { Validators } from "@angular/forms"

export type FieldConfig = {
    name: string,
    label: string,
    placeholder?: string
    type: string,
    value?: any
    validator: Validators
}