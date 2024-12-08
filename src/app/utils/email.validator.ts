import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function emailValidator(suffixes: string[]): ValidatorFn {
  console.log('Email validator', suffixes);
  const pattern = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(${suffixes.join('|')})$`;
    return (control: AbstractControl) => {
        const email = control.value;
        const isValid = email === '' || new RegExp(pattern).test(email);
        console.log('Email validator', email, isValid);
        
        return isValid ? null : { emailValidator: true };
    };
}
