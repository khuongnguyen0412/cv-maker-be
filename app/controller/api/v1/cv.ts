import { Controller } from "egg";
import asyncBusboy from "async-busboy";

/**
 * @Controller V1/CV
 */
export default class CvController extends Controller {
  public async index() {
    const { ctx } = this;
    const { pageIndex, pageSize } = ctx.request.query;
    let data = await ctx.service.cv.getAll(
      Number(pageIndex ?? 1),
      Number(pageSize ?? 10)
    );
    data = { list: data.rows, total: data.count, pageIndex, pageSize };
    ctx.helper.response.success({ ctx, data });
  }

  public async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = await ctx.service.cv.get(id);
    if (data) {
      ctx.helper.response.success({ ctx, data });
    } else {
      ctx.helper.response.error({ ctx, code: 404, message: "Not found" });
    }
  }

  public async create() {
    const { ctx } = this;
    const {
      files,
      fields: {
        userId,
        name,
        phone,
        email,
        address,
        gender,
        certifications,
        objective,
        skills,
        experince,
        projects,
      },
    } = await asyncBusboy(ctx.req);
    try {
      const result = await ctx.service.cv.add(
        userId,
        name,
        phone,
        email,
        address,
        gender,
        certifications,
        objective,
        skills,
        experince,
        projects,
        files[0].filename,
        files[0]
      );
      if (result) {
        ctx.helper.response.success({ ctx });
      } else {
        ctx.helper.response.error({ ctx });
      }
    } catch (error) {
      ctx.helper.response.error({ ctx, message: "Error: " + error });
    }
  }

  public async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const {
      files,
      fields: {
        name,
        phone,
        email,
        address,
        gender,
        certifications,
        objective,
        skills,
        experince,
        projects,
      },
    } = await asyncBusboy(ctx.req);
    try {
      const result = await ctx.service.cv.update(
        id,
        name,
        phone,
        email,
        address,
        gender,
        certifications,
        objective,
        skills,
        experince,
        projects,
        files[0]?.filename || undefined,
        files[0] || undefined
      );
      if (result) {
        ctx.helper.response.success({ ctx });
      } else {
        ctx.helper.response.error({ ctx });
      }
    } catch (error) {
      ctx.helper.response.error({ ctx, message: "Error: " + error });
    }
  }

  public async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await this.ctx.model.Cv.delete(Number(id));
    ctx.helper.response.success({ ctx, result });
  }
}
