// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {env} from './env/env';

export const environment = {
  production: false,
  apiServer: env.apiServer || 'http://api.todolist.loc:8000/',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
