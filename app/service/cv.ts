import { Service } from "egg";
import moment from "moment";
import S3 from "./thirdparty/aws/S3";
const util = require("util");
const fs = require("fs");
const stream = require("stream");
const pipeline = util.promisify(stream.pipeline);
const cloudinary = require("cloudinary").v2;
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const path = require("path");
const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);

/**
 * CV Service
 */
export default class CV extends Service {
  public async add(
    userId: number,
    name: string,
    jobTitle: string,
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
    file: any,
    templateId: number
  ) {
    const path = `./images/${avatar}`;
    await pipeline(file, fs.createWriteStream(path));

    cloudinary.config(this.config.cloudinary);

    const uploaded = await cloudinary.uploader.upload(
      path,
      async (_, result) => {
        if (result) {
          // Remove image local
          await fs.unlinkSync(path);
          avatar = result.url;
        } else {
          return false;
        }
      }
    );

    if (!uploaded) {
      return false;
    }

    return await this.ctx.model.Cv.add(
      userId,
      name,
      jobTitle,
      phone,
      email,
      address,
      gender,
      certifications,
      objective,
      skills.split(","),
      experince,
      projects,
      avatar,
      templateId
    );
  }

  public async update(
    id: number,
    name: string,
    jobTitle: string,
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
    file: any,
    templateId: number
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
            jobTitle,
            phone,
            email,
            address,
            gender,
            certifications,
            objective,
            skills.split(","),
            experince,
            projects,
            result.url,
            templateId
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
        jobTitle,
        phone,
        email,
        address,
        gender,
        certifications,
        objective,
        skills.split(","),
        experince,
        projects,
        null,
        templateId
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

  public async generatePDF(id: number) {
    try {
      const cv = await this.ctx.model.Cv.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: this.ctx.model.Template,
            attributes: ["name"],
          },
        ],
        raw: true,
      });

      const content = fs.readFileSync(
        path.resolve(__dirname, `../../templates/${cv["template.name"]}.docx`),
        "binary"
      );

      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Format Data
      const experinceFormat = cv.experince?.map((item) => {
        return {
          fromto: item.fromto.join(" - "),
          position: item.position,
          companyName: item.companyName,
          description: item.description,
        };
      });

      const projectsFormat = cv.projects?.map((item) => {
        return {
          fromto: item.fromto.join(" - "),
          customer: item.customer,
          position: item.position,
          teamSize: item.teamSize,
          technology: item.technology.join(", "),
          projectName: item.projectName,
        };
      });

      doc.render({
        ...cv,
        skills: cv.skills?.join(", "),
        experince: experinceFormat,
        projects: projectsFormat,
        hasExperince: experinceFormat ? true : false,
        hasProjects: projectsFormat ? true : false,
        hasCertifications: cv.certifications ? true : false,
      });

      const buf = doc.getZip().generate({
        type: "nodebuffer",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
      });

      // Convert docx to pdf
      let pdfBuf = await libre.convertAsync(buf, "pdf", undefined);

      // Upload S3
      const key = `cvs/CV_${cv.name}_${moment().format(
        "YYYY-MM-DD_HH-mm-ss"
      )}.pdf`;
      const s3 = new S3(this.ctx);
      s3.putObject(pdfBuf, key).then(async (res) => {
        if (res) {
          await this.ctx.model.Cv.editPath(id, key);
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      return false;
    }
  }

  public async downloadPDF(key: string) {
    const s3 = new S3(this.ctx);
    const data = await s3.downSign(key);
    return data;
  }
}
