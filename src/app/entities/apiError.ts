import {Type} from 'class-transformer';
import {ValidationError} from './validation-error';

export class ApiError {
  message: string;
  code: number;

  @Type(() => ValidationError)
  validationErrors: ValidationError[];
}
