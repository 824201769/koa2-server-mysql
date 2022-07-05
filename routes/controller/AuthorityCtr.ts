import { Controller, authority, Post, Get, LoginUser } from '../../config/lib';
import { IRouterContext } from 'koa-router';
import AuthorityService from '../../server/AuthorityService';
import env from '../../config/env';

@Controller({ prefix: '/api/authority' })
export default class AuthorityCtr {
  /**
   * 查询角色
   */
  @Get
  @authority([env.adminAuthority])
  async queryAuthority(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await AuthorityService.queryAuthority();
    await next();
  }

  /**
   * 增加角色
   */
  @Post
  @authority([env.adminAuthority])
  async createAuthority(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await AuthorityService.createAuthority(ctx.request.body as any);
    await next();
  }
  /**
   * 删除角色
   */
  @Get
  @authority([env.adminAuthority])
  async deleteAuthority(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await AuthorityService.deleteAuthority(ctx.request.query.id as any);
    await next();
  }
  /**
   * 修改角色
   */
  @Post
  @authority([env.adminAuthority])
  async updateAuthority(ctx: IRouterContext, user: LoginUser, next: Function) {
    ctx.body = await AuthorityService.updateAuthority(ctx.request.body as any);
    await next();
  }
}
