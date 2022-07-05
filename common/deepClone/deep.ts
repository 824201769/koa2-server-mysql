//对象深度拷贝
export class deep<T> {
  static clone(value: any) {
    return JSON.parse(JSON.stringify(value));
  }
  static parse(value: any) {
    return JSON.parse(value);
  }
}
