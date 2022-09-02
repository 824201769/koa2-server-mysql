import { sequelize, DataTypes, Model } from "../config/sequelize";
/**
 * 菜单表
 */
class Menu extends Model {
  id: number;
  pid: number; //父级id 顶级为0
  componentName: string; //组件名称
  path: string; //菜单路径
  title: string; //菜单标题
  permissionsId: number; //权限id
}
Menu.init(
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
    permissionsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    path: {
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
    tableName: "menu",
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["permissionsId"],
      },
    ],
    sequelize,
  }
);

export default Menu;
