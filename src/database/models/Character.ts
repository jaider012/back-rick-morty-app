import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../config/database";

export class Character extends Model {
  public id!: number;
  public name!: string;
  public status!: string;
  public species!: string;
  public type!: string;
  public gender!: string;
  public origin!: string;
  public location!: string;
  public image!: string;
}

Character.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Character",
    timestamps: true,
  }
);
