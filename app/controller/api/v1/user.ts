import { Controller } from "egg";

// Verify user registration parameters
const vUser = {
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
};
/**
 * @Controller V1/User
 */
export default class UserController extends Controller {
  public async index() {
    const { ctx } = this;
    const { pageIndex, pageSize } = ctx.request.query;
    let data = await this.ctx.model.User.getAll(Number(pageIndex ?? 1), Number(pageSize ?? 10));
    data = { list: data.rows, total: data.count, pageIndex, pageSize }
    ctx.helper.response.success({ ctx, data });
  }

  public async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = await this.ctx.model.User.findById(Number(id));
    ctx.helper.response.success({ ctx, data });
  }

  public async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name, age } = ctx.request.body;
    const data = await this.ctx.model.User.edit(Number(id), name, age);
    ctx.helper.response.success({ ctx, data });
  }

  public async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await this.ctx.model.User.delete(Number(id));
    ctx.helper.response.success({ ctx, result });
  }

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
