import {User} from './user';

export class Token {
  uuid: string;
  createdAt: Date;
  lastUsageAt: Date;
  user: User;
}
