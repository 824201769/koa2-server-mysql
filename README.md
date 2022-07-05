创建表
<!-- import { sequelize, DataTypes, Model } from '../config/sequelize';
class User extends Model {
  id: number;
  username: string; //用户名
  password: string; //密码
  province: {
    //省份
    code: '';
    name: '';
  };
  city: {
    //市区
    code: '';
    name: '';
  };
  authorityId: number; // 角色 id
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
    province: {
      type: DataTypes.JSON,
    },
    city: {
      type: DataTypes.JSON,
    },
    authorityId: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    ],
    sequelize,
  }
);

export default User; -->

配置权限
  <!-- @Post
  @authority([env.adminAuthority])
  async createCarousel(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await CarouselService.createAuthority(ctx.request.body as any);
    await next();
  } -->
创建路由
<!-- @Controller({ prefix: '/api/auth' })
export default class AuthCtr {} -->
创建服务
<!-- class UserService {}
const userService = new UserService();
export default userService; -->
