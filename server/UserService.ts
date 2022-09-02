import User from '../models/UserModel';
import crypto from 'crypto';
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
import env from '../config/env';
import redis from '../config/Redis';
import { deep, ServiceResult } from '../common';

class UserService {

  /**
   * 登陆
   * @param {string} username,
   * @param {string} password
   */
  async login(username: string, password: string) {
    try {
      if (!username || !password) {
        return ServiceResult.getFail('用户名或者密码不能为空！');
      }
      //判断用户名是否存
      let user = await User.findOne({
        where: {
          username: username,
        },
      });
      if (!user) {
        return ServiceResult.getFail('用户不存在！');
      }
      if (!user.status) {
        return ServiceResult.getFail('您的账号已经被锁定请联系管理员');
      }
      //判断密码是否正确
      let salt_password = crypto.pbkdf2Sync(password, env.noncestr, 10000, 64, 'sha512').toString('base64');
      if (salt_password == user.password) {
        //登录成功
        let jwtdata: any = {};
        jwtdata.userId = user.id;
        jwtdata.sessionId = uuidv4();
        jwtdata.status = user.status;
        jwtdata.role = user.role;
        let token = jwt.sign(jwtdata, env.noncestr, {
          algorithm: 'HS256',
          expiresIn: 43200,
        });
        //先删除已经存在的
        await redis.del(user.id.toString());
        //存储用户 设定24小时
        await redis.set(user.id.toString(), jwtdata.sessionId, 43200);
        //设置 返回的用户信息
        let rtUser: any = {
          userId: user.id,
          role: user.role,
          token: 'Bearer ' + token,
        };
        return ServiceResult.getSuccess(rtUser);
      } else {
        return ServiceResult.getFail('密码错误');
      }
    } catch (error) {
      return ServiceResult.getFail('登录失败');
    }
  }
  /**
   * 创建用户
   * @param username  用户名
   * @param password  密码
   * @param authorityId  角色 id
   * @param province  省份
   * @param city 市区
   * @param realname  真是姓名
   * @param phone  手机号
   * @param startTime  权限开始时间
   * @param endTime  权限结束时间
   * @returns
   */
  async saveUser(
    form: {
      username: string;

      province: {
        code: string;
        name: string;
      };
      city: {
        code: string;
        name: string;
      };
      realname: string;
      phone: string;
      authorityId: number;
      userCount: number;
      password?: string;
      id?: string;
      campusId?: string;
      startTime?: number;
      endTime?: number;
      campusType?: number;
      campusName?: string;
      courseIdList?: [];
      value?: [];
    },
    loginUser?: any
  ) {
    if (form.username) {
      //用户名称
      let where: any = {};
      if (form.id) {
        where.id = {
          $ne: form.id,
        };
      }
      where.username = form.username;
      let isUser = await User.findOne({
        where: where,
      });
      if (isUser) {
        //判断用户名是都被注册
        return ServiceResult.getFail('用户名已经被注册');
      }
    }


    if (!form.province.code || !form.city.code) {
      return ServiceResult.getFail('省份或市区不可以为空');
    }


    let userInterface: any = {
      username: form.username,
      realname: form.realname,
      authorityId: form.authorityId,
      phone: form.phone,
      province: form.province || undefined,
      city: form.city || undefined,
      status: true,
    };
    //生成新的密码并赋值
    if (form.password) {
      userInterface.password = crypto.pbkdf2Sync(form.password, env.noncestr, 10000, 64, 'sha512').toString('base64');
    }
    try {
      let user: any = {};
      let userId = '';
      if (form.id) {
        userId = form.id;
        user = await User.update(userInterface, { where: { id: form.id } });
      } else {
        user = await User.create(userInterface); //注册信息加入都 user 表
        userId = user.id;
      }
      if (!userId) {
        return ServiceResult.getFail('用户保存失败,请刷新后重试');
      } else {
        return ServiceResult.getSuccess('操作成功');
      }
    } catch (error) {
      console.log('error', error);
      return ServiceResult.getFail('保存用户信息失败');
    }
  }

  /**
   * 修改密码
   * @param {string} userId 用户 id
   * @param {string} password 密码
   */
  async updatePassword(userId: number, password: string) {
    if (!password) {
      return ServiceResult.getFail('密码不可以为空');
    }
    let user: any = {};
    //生成新的密码并赋值
    user.password = crypto.pbkdf2Sync(password, env.noncestr, 10000, 64, 'sha512').toString('base64');
    //生成要修改的数据
    try {
      let sr: any = await User.update(
        {
          password: user.password,
          salt: user.salt,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      if (sr[0] === 1) {
        return ServiceResult.getSuccess('操作成功!');
      }
      return ServiceResult.getFail('操作失败!');
    } catch (error) {
      return ServiceResult.getFail('密码修改修改');
    }
  }






}
const userService = new UserService();

export default userService;
