import env from './env';
import { Sequelize, DataTypes, Model, Op, QueryTypes } from 'sequelize';
const sequelize = new Sequelize(env.dbName, env.dbUser, env.dbPwd, {
  host: env.dbUrl,
  dialect: 'mysql',
  timezone: '+08:00',
  define: {
    freezeTableName: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((err: any) => {
    console.log('数据库连接失败:', err);
  });
sequelize
  .sync
  // { alter: true }
  ()
  .then(() => {
    console.log('init db ok');
  })
  .catch((err: any) => {
    console.log('init db error', err);
  });
export { sequelize, DataTypes, Model, Op, QueryTypes };
