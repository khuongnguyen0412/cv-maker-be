import { Controller } from "egg";

// Verify user registration parameters
const vUser = {
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
};
/**
 * @Controller V1/Auth
 */
export default class AuthController extends Controller {

  public async register() {
    const { ctx } = this;
    const { name, email, dob, password } = ctx.request.body;
    const data = await ctx.service.user.rigist(name, email, dob, password);
    ctx.helper.response.success({ ctx, data });
  }

  public async login() {
    const { ctx } = this;
    // Receive and verify parameters
    ctx.validate(vUser, ctx.request.body);
    const {email, password} = ctx.request.body;
    const data = await ctx.service.user.login(email, password);
    if (!data) {
      ctx.helper.response.error({ ctx, message: 'Email or Password is incorrect', code: 401 });
      return false;
    }else{
      ctx.helper.response.success({ ctx, data: data });
    }
  }
}
