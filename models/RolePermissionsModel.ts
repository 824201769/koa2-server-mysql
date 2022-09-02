import { sequelize, DataTypes, Model } from "../config/sequelize";
/**
 * 角色对应表
 */
class RoleMenu extends Model {
  id: number;
  roleId: number; //角色id
  permissionsId: number; //权限id
}
RoleMenu.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissionsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "role_permissions",
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["roleId"],
      },
      {
        fields: ["permissionsId"],
      },
    ],
    sequelize,
  }
);

export default RoleMenu;
