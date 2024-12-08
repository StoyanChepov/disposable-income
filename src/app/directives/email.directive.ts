import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { emailValidator } from '../utils/email.validator';

@Directive({
  selector: '[appEmail]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, multi: true, useExisting: EmailDirective },
  ],
})
export class EmailDirective implements Validator {
  @Input() appEmail: string[] = [];

  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    const validatorFn = emailValidator(this.appEmail);
    return validatorFn(control);
  }
}
