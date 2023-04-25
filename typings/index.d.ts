import 'egg';

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'egg' {
  // extend app
  interface Application {
    Sequelize: typeof sequelize;
    mysql: IModel;
    victorModel: IModel;
    localIp: string | undefined; // 内网IP
  }

  // extend context
  interface Context {
    mysql: IModel;
    victorModel: IModel;
  }
}