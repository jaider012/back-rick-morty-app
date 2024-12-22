import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../config/database";
import { Character } from "./Character";

export class Comment extends Model {
  public id!: number;
  public characterId!: number;
  public content!: string;
  public created!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Character,
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    timestamps: true,
  }
);

// Establish relationship
Character.hasMany(Comment, {
  foreignKey: "characterId",
  as: "comments",
});
Comment.belongsTo(Character, {
  foreignKey: "characterId",
});
