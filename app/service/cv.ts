import { Service } from "egg";
const util = require("util");
const fs = require("fs");
const stream = require("stream");
const pipeline = util.promisify(stream.pipeline);
const cloudinary = require("cloudinary").v2;

/**
 * CV Service
 */
export default class CV extends Service {
  public async add(
    userId: number,
    name: string,
    phone: string,
    email: string,
    address: string,
    gender: number,
    certifications: string,
    objective: string,
    skills: string,
    experince: string,
    projects: string,
    avatar: string,
    file: any
  ) {
    const path = `./images/${avatar}`;
    await pipeline(file, fs.createWriteStream(path));

    cloudinary.config(this.config.cloudinary);

    await cloudinary.uploader.upload(path, async (_, result) => {
      if (result) {
        // Remove image local
        await fs.unlinkSync(path);
        await this.ctx.model.Cv.add(
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
          result.url
        );
        return true;
      } else {
        return false;
      }
    });
    return true;
  }

  public async update(
    id: number,
    name: string,
    phone: string,
    email: string,
    address: string,
    gender: number,
    certifications: string,
    objective: string,
    skills: string,
    experince: string,
    projects: string,
    avatar: string,
    file: any
  ) {
    if (file) {
      const path = `./images/${avatar}`;
      await pipeline(file, fs.createWriteStream(path));

      cloudinary.config(this.config.cloudinary);

      await cloudinary.uploader.upload(path, async (_, result) => {
        if (result) {
          // Remove image local
          await fs.unlinkSync(path);
          const resultUpdate = await this.ctx.model.Cv.edit(
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
            result.url
          );
          return resultUpdate;
        } else {
          return false;
        }
      });
    } else {
      const result = await this.ctx.model.Cv.edit(
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
        null
      );
      return result;
    }
    return true;
  }

  public async get(id: number) {
    const result = await this.ctx.model.Cv.findById(id);
    return result;
  }

  public async getAll(pageIndex: number, pageSize: number) {
    const result = await this.ctx.model.Cv.getAll(pageIndex, pageSize);
    return result;
  }

  public async delete(id: number) {
    const result = await this.ctx.model.Cv.delete(id);
    return result;
  }
}
