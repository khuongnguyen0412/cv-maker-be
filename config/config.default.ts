import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.sequelize = {
    dialect: "",
    database: "",
    host: "",
    port: 3306,
    username: "",
    password: "",
  };

  config.aws = {
    accessKeyId: "",
    secretAccessKey: "",
    s3: {
      region: "",
      bucket: "",
      cdn: "",
    },
  };

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1672212752156_9470";

  // add your egg config in here
  config.middleware = [];

  config.jwt = {
    secret: '%$hgh3424',
  };

  config.bcrypt = {
    saltRounds: 10,
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.security = {
   csrf: {
      enable: false,
      ignoreJSON: true,
    },
    // Whitelist of allowed access interfaces
    domainWhiteList: [ 'http://localhost:8080' ],
  };

  // Cross-domain configuration
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // egg-swagger-doc 配置信息
  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'egg-swagger',
      description: 'swagger-ui for egg',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      // apikey: {
      //   type: 'apiKey',
      //   name: 'clientkey',
      //   in: 'header',
      // },
      oauth2: {
        type: 'oauth2',
        tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
        flow: 'password',
        scopes: {
          'write:access_token': 'write access_token',
          'read:access_token': 'read access_token',
        },
      },
    },
    enableSecurity: false,
    // enableValidate: true,
    routerMap: false,
    enable: true,
  }

  config.cloudinary = {
    cloud_name: '',
    api_key: '',
    api_secret: ''
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
