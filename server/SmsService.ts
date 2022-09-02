import Redis from "../config/Redis";
import smsRest from "../config/SmsRest";
const verificationCodeKey="verificationCodeKey"
// ********************************************
//             发送验证短信验证码
// ********************************************

class SmsService {
	static templateCode() {
		return ['SMS_149710090', 'SMS_149710089', 'SMS_149710088', 'SMS_149710087', 'SMS_149710086', 'SMS_149710085'];
	}
	constructor() {
		//this.verificationCodeKey = 'verificationCodeKey';
	}

	/**
	 * 发送短信验证码
	 * @param {string} app 产品模块
	 * @param {string} phoneNumber 手机号
	 * @param {string} signName 短信签名
	 * @param {string} templateCode 短信模版 身份验证验证码 SMS_149710090  登录确认验证码 SMS_149710089 登录异常验证码 SMS_149710088 用户注册验证码 SMS_149710087 修改密码验证码 SMS_149710086 信息变更验证码 SMS_149710085
	 */
	async sendVerificationCode(app:string, phoneNumber:string, signName:string, templateCode:string) {

		//随机生产验证码
		let code = (Math.random() * 10000).toFixed(0);
		if(code.length<5){
			for (let i = 0; i = 5 - code.length; i++) {
                code += "0"
            }
		}
		let key = `${app}_${phoneNumber}_${verificationCodeKey}`;

		await Redis.set(key, code, 600);
		let sr =await Promise.race([smsRest.sendSms(phoneNumber, signName, templateCode, JSON.stringify({ code }))])  
		return sr;
	}
	/**
	 * 验证短信验证码
	 * @param {string} app 产品模块
	 * @param {string} phoneNumber 手机号
	 * @param {string} code 验证码
	 */
	async verificationCode(app:string, phoneNumber:string, code:string) {

		let key = `${app}_${phoneNumber}_${verificationCodeKey}`;
		let _code = await Promise.race([ Redis.get(key)]);
	
		if (code === _code) {
			return true;
		}
		return false;
	}

}
const smsService = new SmsService();
// smsService.sendVerificationCode('app', '18602153656', '测试', 'SMS_149710087');
export default smsService