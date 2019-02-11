export class Alert {
  type: string;
  message: string;

  constructor(type: string = 'primary', message: string = '') {
    this.type = type;
    this.message = message;
  }
}
