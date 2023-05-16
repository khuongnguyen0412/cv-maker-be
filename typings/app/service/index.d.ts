// This file is created by egg-ts-helper@1.33.1
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportCv from '../../../app/service/cv';
import ExportTemplate from '../../../app/service/template';
import ExportUser from '../../../app/service/user';
import ExportThirdpartyAwsS3 from '../../../app/service/thirdparty/aws/S3';

declare module 'egg' {
  interface IService {
    cv: AutoInstanceType<typeof ExportCv>;
    template: AutoInstanceType<typeof ExportTemplate>;
    user: AutoInstanceType<typeof ExportUser>;
    thirdparty: {
      aws: {
        s3: AutoInstanceType<typeof ExportThirdpartyAwsS3>;
      }
    }
  }
}
