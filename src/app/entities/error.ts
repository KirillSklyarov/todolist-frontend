import {ValidationErrors} from '@angular/forms';

export class Error {
  message: string;
  code: number;
  validationErrors: ValidationErrors;
}
