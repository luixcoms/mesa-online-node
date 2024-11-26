"use strict";
const { Model } = require("sequelize");
const dateTimeValidator = require("../../utils/dateAndTimeValidator");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.customer, {
        foreignKey: {
          allowNull: false,
        },
        onDelete: "cascade",
        onUpdate: "cascade",
        hooks: true,
      });
      Reservation.hasMany(models.table, {
        onUpdate: "cascade",
        hooks: true,
      });
    }
  }
  Reservation.init(
    {
      resDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Por favor coloque a data de reserva",
          },
          isDateInThePast(value) {
            const currDate = dateTimeValidator.asDateString(new Date());
            if (dateTimeValidator.isDateInThePast(currDate, value))
              throw new Error("Essa data está no passado!");
          },
        },
      },
      resTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Por favor coloque a hora da reserva!",
          },
        },
      },
      people: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            arg: true,
            msg: "Precisa ser um valor inteiro!",
          },
          min: {
            args: [1],
            msg: "Uma pessoa pelo menos!",
          },
          max: {
            args: [20],
            msg: "Máximo de 20 pessoas por reserva!",
          },
        },
      },
      resStatus: {
        type: DataTypes.ENUM("pending", "seated", "missed"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "reservation",
    }
  );
  return Reservation;
};
