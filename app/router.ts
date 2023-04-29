import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;

  router.get('/', controller.home.index);

  // ====== API ======
  const apiV1 = app.router.namespace('/api/v1');

  // ====== Auth ======
  apiV1.post('/auth/login', controller.api.v1.user.login);
  apiV1.post('/auth/register', controller.api.v1.user.register);
  
  // ====== User ======
  apiV1.resources('users', '/users', middleware.auth(), controller.api.v1.user);

  // ====== Cv ======
  apiV1.resources('cvs', '/cvs', middleware.auth(), controller.api.v1.cv);
  apiV1.post('/cvs/generate-pdf/:id', middleware.auth(), controller.api.v1.cv.generatePDF);
  
  // ====== Template ======
  apiV1.resources('templates', '/templates', middleware.auth(), controller.api.v1.template);
};
