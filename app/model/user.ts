module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define("user", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    email: STRING(50),
    password: STRING(255),
    dob: DATE,
  });

  User.add = async function (name: string, email: string, dob: string, password: string) {
    return await this.create({
      name,
      email,
      password,
      dob
    }).then(function (result) {
      if (result) {
        return true;
      } else {
        return false;
      }
    });
  };

  User.findById = async function (id) {
    return await this.findOne({
      attributes: ["id", "name", "age", "createdAt", "updatedAt"],
      where: {
        id: id,
      },
    });
  };

  User.edit = async function (id: number, name: string, age: number) {
    return await this.update(
      { name: name, age: age ?? 1, updated_at: Date.now() },
      { where: { id: id } }
    )
      // .success(function () {
      //   return true;
      // })
      // .error(function (err) {
      //   console.log(err);
      //   return false;
      // });
  };

  User.getAll = async function(pageIndex: number, pageSize: number) {
    try {
      return await this.findAndCountAll({
        offset: pageIndex,
        limit: pageSize,
      });
    } catch (error) {
      return {
        status: false,
        error: error
      };
    }
  };

  User.delete = async function (id) {
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

  return User;
};
