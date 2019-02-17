import {Exclude, Type} from 'class-transformer';
import {ApiError} from './apiError';

export class ApiResponse<T> {
  @Exclude()
  private type;

  success: boolean;

  @Type(() => ApiError)
  error: ApiError;

  @Type(options => {
    return (options.newObject as ApiResponse<T>).type;
  })
  data: T;

  constructor(type: Function) {
    this.type = type;
  }
}
