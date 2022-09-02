import { sequelize, DataTypes, Model } from "../config/sequelize";
/**
 * 角色表
 */
class Role extends Model {
  id: number;
  title: string; //角色标题
  sign: string; //角色标记
  desc: string; //角色说明
}
Role.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sign: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "role",
    indexes: [
      {
        fields: ["id"],
      },
    ],
    sequelize,
  }
);

export default Role;
