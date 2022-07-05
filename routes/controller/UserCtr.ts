import { Controller, authority, Post, Get, LoginUser } from '../../config/lib';
import { IRouterContext } from 'koa-router';
import UserService from '../../server/UserService';
import env from '../../config/env';

@Controller({ prefix: '/api/user' })
export default class CourseCtr {
  /**
   * 查询注册教师数量
   */
  @Get
  @authority([env.adminAuthority])
  async queryRouter(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await UserService.queryTeacherCount();
    await next();
  }
  /**
   * 查询用户信息
   */
  @Get
  @authority()
  async queryUserInfo(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await UserService.queryUserInfo(user.userId);
    await next();
  }
  /**
   * 保存用户
   */
  @Post
  @authority([env.adminAuthority, env.schoolAuthority])
  async saveUser(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await UserService.saveUser(ctx.request.body as any, user);
    await next();
  }
  /**
   * 修改密码
   */
  @Post
  @authority([env.adminAuthority])
  async updatePassword(ctx: IRouterContext, user: LoginUser, next: Function) {
    let item: any = ctx.request.body;
    ctx.body = await UserService.updatePassword(user.userId, item.password);
    await next();
  }
  /**
   * 删除账号
   */
  @Post
  @authority([env.adminAuthority])
  async deleteUser(ctx: IRouterContext, user: LoginUser, next: Function) {
    let { id } = ctx.request.body as any;
    ctx.body = await UserService.deleteUser(id, user);
    await next();
  }
  /**
   * 解禁,封禁账号
   */
  @Post
  @authority([env.adminAuthority])
  async disableUser(ctx: IRouterContext, user: LoginUser, next: Function) {
    let item: any = ctx.request.body;
    ctx.body = await UserService.disableUser(user.userId, item.status);
    await next();
  }
  /**
   * 查询教师数量
   */
  @Get
  @authority([env.adminAuthority])
  async queryTeacherCount(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await UserService.queryTeacherCount();
    await next();
  }

  /**
   * 根据条件查询用户
   */
  @Post
  @authority([env.adminAuthority, env.schoolAuthority])
  async queryUser(ctx: IRouterContext, user: LoginUser, next: Function) {
    let data: any = ctx.request.body;
    ctx.body = await UserService.queryUser(data.where, parseInt(data.page) || 1, parseInt(data.limit) || 5, user);
    await next();
  }

  /**
   * 查询管理员
   */
  @Post
  @authority([env.adminAuthority, env.schoolAuthority])
  async queryUserAdmin(ctx: IRouterContext, user: LoginUser, next: Function) {
    let data: any = ctx.request.body;
    ctx.body = await UserService.queryUserAdmin(data.where, parseInt(data.page) || 1, parseInt(data.limit) || 5);
    await next();
  }

  /**
   * 根据条件查询用户详细信息
   */
  @Get
  @authority([env.adminAuthority, env.schoolAuthority])
  async queryUserDetailed(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await UserService.queryUserDetailed(ctx.request.query.id as any);
    await next();
  }
}
