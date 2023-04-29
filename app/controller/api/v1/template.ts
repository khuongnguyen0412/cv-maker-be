import { Controller } from "egg";

/**
 * @Controller Template/CV
 */
export default class CvController extends Controller {
  public async index() {
    const { ctx } = this;
    let data = await ctx.service.template.getAll();
    data = { list: data.rows, total: data.count };
    ctx.helper.response.success({ ctx, data });
  }

  public async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = await ctx.service.template.get(id);
    if (data) {
      ctx.helper.response.success({ ctx, data });
    } else {
      ctx.helper.response.error({ ctx, code: 404, message: "Not found" });
    }
  }
}
