// This file is created by egg-ts-helper@1.33.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCv from '../../../app/model/cv';
import ExportTemplate from '../../../app/model/template';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Cv: InstanceType<ExportCv>;
    Template: InstanceType<ExportTemplate>;
    User: InstanceType<ExportUser>;
  }
}
