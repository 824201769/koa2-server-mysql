import { Controller, authority, Post, Get, LoginUser } from "../../common";
import { IRouterContext } from "koa-router";
import UserService from "../../server/UserService";
import env from "../../config/env";

@Controller({ prefix: "/api/user" })
export default class CourseCtr {
  /**
   * 保存用户
   */
  @Post
  @authority()
  async saveUser(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await UserService.saveUser(ctx.request.body as any, user);
    await next();
  }
  /**
   * 修改密码
   */
  @Post
  @authority()
  async updatePassword(ctx: IRouterContext, user: LoginUser, next: Function) {
    let item: any = ctx.request.body;
    ctx.body = await UserService.updatePassword(user.userId, item.password);
    await next();
  }
}
