export class ApiResponse<T> {
  success: boolean;
  error: Error;
  data: T;
}
