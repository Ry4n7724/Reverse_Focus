import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function emptyListValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isEmpty = control.value && Array.isArray(control.value) && control.value.length === 0;
        return isEmpty ? { 'emptyList': true } : null;
    };
}