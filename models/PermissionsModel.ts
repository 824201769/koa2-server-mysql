import { sequelize, DataTypes, Model } from "../config/sequelize";
/**
 * 权限表
 */
class Permissions extends Model {
  id: number;
  pid: number; //父级id 顶级为0
  sign: string; //权限标识
  title: string; //权限标题
}
Permissions.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sign: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "permissions",
    indexes: [
      {
        fields: ["id"],
      }
    ],
    sequelize,
  }
);

export default Permissions;
