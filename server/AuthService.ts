import { LoginUser, ServiceResult } from '../common';
import { IRouterContext } from 'koa-router';
import redis from '../config/Redis';

class AuthService {
  /**
   * 单点登录鉴权
   * @param user
   * @param params
   */
  async auth(user: LoginUser, params: any, ctx: IRouterContext): Promise<ServiceResult<LoginUser>> {
    let _user: any = user;
    let _user_: any = {};
    let sessionId = await redis.get(user.userId.toString());

    if (!sessionId) {
      return ServiceResult.getFail('401', _user_, 401);
    }
    if (sessionId == _user.sessionId) {
      return ServiceResult.getSuccess(user);
    } else {
      return ServiceResult.getFail('401', _user_, 401);
    }
  }
}

const authService = new AuthService();
export default authService;
