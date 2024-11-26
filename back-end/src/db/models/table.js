"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    static associate(models) {
      Table.belongsTo(models.reservation, {
        onUpdate: "cascade",
        hooks: true,
      });
    }
  }
  Table.init(
    {
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
          async isUnique(value) {
            const table = await Table.findOne({
              where: {
                name: value,
              },
            });
            if (table) throw new Error("Uma mesa com esse nome já existe");
          },
          notEmpty: {
            arg: true,
            msg: "O nome da mesa não pode ficar branco!",
          },
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          notEmpty: {
            arg: true,
            msg: "Capacidade não pode ficar em branco!",
          },
          isInt: {
            arg: true,
            msg: "Precisa ser um valor inteiro!",
          },
          min: {
            args: [1],
            msg: "Um assento pelo menos!",
          },
          max: {
            args: [8],
            msg: "Máximo 8 assentos por mesa!",
          },
        },
      },
      isOccupied: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "table",
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    }
  );
  return Table;
};
