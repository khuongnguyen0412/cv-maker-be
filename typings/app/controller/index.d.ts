// This file is created by egg-ts-helper@1.33.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportApiV1Auth from '../../../app/controller/api/v1/auth';
import ExportApiV1Cv from '../../../app/controller/api/v1/cv';
import ExportApiV1Template from '../../../app/controller/api/v1/template';
import ExportApiV1User from '../../../app/controller/api/v1/user';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    api: {
      v1: {
        auth: ExportApiV1Auth;
        cv: ExportApiV1Cv;
        template: ExportApiV1Template;
        user: ExportApiV1User;
      }
    }
  }
}
