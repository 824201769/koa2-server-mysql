//消息返回
export class ServiceResult<T> {
  errcode: number = 0;
  errmsg: string = '';
  success: boolean = true;
  data?: T = {} as T;
  /**
   *
   * @param {*} data
   */
  constructor(data?: T) {
    this.data = data;
  }

  static newInstance<T>() {
    return new ServiceResult<T>();
  }

  /**
   *
   * @param {ServiceResult} data
   */
  static getSuccess<T>(data?: T) {
    //成功消息
    return new ServiceResult<T>(data);
  }

  /**
   *
   * @param {number} errcode
   * @param {string} errmsg
   * @param {ServiceResult} data
   */
  static getFail<T>(errmsg: string, data?: T, errcode: number = -1) {
    //错误消息
    let rt = new ServiceResult<T>(data);
    rt.success = false;
    rt.errcode = errcode;
    rt.errmsg = errmsg;
    return rt;
  }

  /**
   * 失败
   * @param errmsg
   * @param errcode
   */
  fail(errmsg: string, errcode: number = -1) {
    this.success = false;
    this.errcode = errcode;
    this.errmsg = errmsg;
    return this;
  }
}
