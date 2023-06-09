module.exports = (app) => {
  const { STRING, INTEGER, TINYINT, JSON } = app.Sequelize;

  const Cv = app.model.define("cv", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: INTEGER, references: "users", referencesKey: "id" },
    name: STRING(255),
    jobTitle: STRING(255),
    phone: STRING(10),
    email: STRING(255),
    address: STRING(255),
    gender: TINYINT,
    certifications: JSON,
    objective: STRING,
    skills: JSON,
    experince: JSON,
    projects: JSON,
    avatar: STRING,
    path: STRING,
    templateId: INTEGER
  });

  Cv.add = async function (
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
    templateId: number
  ) {
    return await this.create({
      userId,
      name,
      jobTitle,
      phone,
      email,
      address,
      gender,
      certifications,
      objective,
      skills,
      experince,
      projects,
      avatar,
      templateId,
    }).then(function (result) {
      if (result) {
        return result;
      } else {
        return false;
      }
    });
  };

  Cv.findById = async function (id) {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  };

  Cv.edit = async function (
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
    templateId: number
  ) {
    const cv = {
      name,
      jobTitle,
      phone,
      email,
      address,
      gender,
      certifications,
      objective,
      skills,
      experince,
      projects,
      avatar,
      templateId,
    };
    const filterCv = Object.fromEntries(
      Object.entries(cv).filter(([_, v]) => v != null)
    );

    return await this.update(filterCv, { where: { id: id } });
  };

  Cv.editPath = async function (id: number, path: string) {
    return await this.update({ path }, { where: { id: id } });
  };

  Cv.getAll = async function (pageIndex: number, pageSize: number) {
    try {
      return await this.findAndCountAll({
        offset: pageIndex - 1,
        limit: pageSize,
      });
    } catch (error) {
      return {
        status: false,
        error: error,
      };
    }
  };

  Cv.delete = async function (id) {
    return await this.destroy({
      where: {
        id: id,
      },
    }).then(
      function (rowDeleted) {
        // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          return true;
        } else {
          return false;
        }
      },
      function (err) {
        console.log(err);
        return false;
      }
    );
  };

  Cv.associate = function() {
    app.model.Cv.belongsTo(app.model.Template);
  }

  return Cv;
};
