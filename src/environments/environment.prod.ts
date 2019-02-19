import {env} from './env/env.prod';

export const environment = {
  apiServer: env.apiServer || '',
  production: true,
  maxCountPerPage: 10,
  defaultCountPerPage: 10,
  tokenLifetime: {
    unregistred: {
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 30,
      years: 0,
    },
    registred: {
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 30,
      years: 0,
    }
  },
};
