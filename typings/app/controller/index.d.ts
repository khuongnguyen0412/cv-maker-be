// This file is created by egg-ts-helper@1.33.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportApiV1Auth from '../../../app/controller/api/v1/auth';
import ExportApiV1User from '../../../app/controller/api/v1/user';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    api: {
      v1: {
        auth: ExportApiV1Auth;
        user: ExportApiV1User;
      }
    }
  }
}
