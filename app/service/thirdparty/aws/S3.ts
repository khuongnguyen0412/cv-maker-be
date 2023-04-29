import { Service } from "egg";
const AWS = require("aws-sdk");

/**
 * AWS S3 Service
 */
export default class S3 extends Service {
  client() {
    const { app } = this;
    const {
      s3: { region },
      accessKeyId,
      secretAccessKey,
    } = app.config.aws;
    return new AWS.S3({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async putObject(data: any, key: string) {
    const { app } = this;
    const {
      s3: { bucket: defaultBucket },
    } = app.config.aws;
    try {
      const base64data = new Buffer(data, "binary");
      const client = this.client();
      const res = client.putObject(
        {
          Bucket: defaultBucket,
          Key: key,
          Body: base64data,
        },
        function () {
          console.log(arguments);
          console.log("Successfully uploaded package.");
        }
      );
      return res.response;
    } catch (error) {
      return error;
    }
  }
}
