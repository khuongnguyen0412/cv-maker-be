import { Service } from "egg";

/**
 * Template Service
 */
export default class Template extends Service {

  public async get(id: number) {
    const result = await this.ctx.model.Template.findById(id);
    return result;
  }

  public async getAll() {
    const result = await this.ctx.model.Template.getAll();
    return result;
  }

}
