import redis from "../../config/Redis";
import {
  Controller,
  LoginUser,
  ServiceResult,
  authority,
  Post,
  Get,
} from "../../common";
import { IRouterContext } from "koa-router";
import UserService from "../../server/UserService";
@Controller({ prefix: "/api/auth" })
export default class AuthCtr {
  /*
   *登录
   */
  @Get
  @authority()
  async login(ctx: IRouterContext, user: LoginUser, next: Function) {
    let data: any = ctx.request.body;
    let sr: any = await UserService.login(data.username, data.password);
    ctx.body = sr;
    await next();
  }

  /*
   *登出
   */
  @Post
  @authority()
  async logout(ctx: IRouterContext, user: LoginUser, next: Function) {
    redis.del(user.userId.toString()).then();
    ctx.body = ServiceResult.getFail("401");
    await next();
  }
}
