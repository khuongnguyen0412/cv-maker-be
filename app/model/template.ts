module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  const Template = app.model.define("templates", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(255),
    image: STRING,
  });

  Template.findById = async function (id) {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  };

  Template.getAll = async function () {
    try {
      return await this.findAndCountAll();
    } catch (error) {
      return {
        status: false,
        error: error,
      };
    }
  };

  return Template;
};
