import { sequelize, DataTypes, Model } from '../config/sequelize';
/**
 * 用户表
 */
class User extends Model {
  id: number;
  username: string; //用户名
  password: string; //密码
  phone: string; //手机
  realname: string; //真实姓名
  status: boolean; //是否可以正常使用账号
  province: {
    //省份
    code: string;
    name: string;
  };
  city: {
    //市区
    code: string;
    name: string;
  };
  role: []; // 角色 id
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    realname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    province: {
      type: DataTypes.JSON,
    },
    city: {
      type: DataTypes.JSON,
    },
    role: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: 'user',
    indexes: [
      {
        fields: ['id'],
      },
      {
        fields: ['username'],
      },
      {
        fields: ['phone'],
      },
    ],
    sequelize,
  }
);

export default User;
