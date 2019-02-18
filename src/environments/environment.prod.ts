import {env} from './env/env.prod';

export const environment = {
  apiServer: env.apiServer || '',
  production: true
};
