import env from "../config/env";
import {ServiceResult} from "marmot-server";
// import SMSClient from '@alicloud/sms-sdk';
const SMSClient = require("@alicloud/sms-sdk")
let accessKeyId = env.accessKeyId || '';
let secretAccessKey = env.accessKeySecret || '';
let smsClient = new SMSClient({
	accessKeyId,
	secretAccessKey
});
class SmsRest {
	/**
	 * 
	 * @param {string} PhoneNumbers 必填: 待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码, 批量调用相对于单条调用及时性稍有延迟, 验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
	 * @param {string} SignName  必填: 短信签名 - 可在短信控制台中找到
	 * @param {string} TemplateCode 必填: 短信模板 - 可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
	 * @param {string} TemplateParam 模板中的变量替换JSON串, 如模板内容为"亲爱的${name},您的验证码为${code}"时。
	 * @returns {Promise<ServiceResult>}
	 */
	async sendSms(PhoneNumbers:string, SignName:string, TemplateCode:string, TemplateParam:string) {
		//发送短信
		return new Promise((resolve, reject) => {

			// @ts-ignore
			smsClient.sendSMS({
				PhoneNumbers,
				SignName,
				TemplateCode,
				TemplateParam
			}).then(function (res:any) {
				let {
					Code
				} = res;
				if (Code === 'OK') {
					console.log("====================")
					console.log("验证码: ", TemplateParam)
					console.log("====================")
					//处理返回参数
					resolve(ServiceResult.getSuccess('ok'));
				}
			}, function (err:any) {
				var error = ''
				switch (err.code) {
					case 'isv.MOBILE_NUMBER_ILLEGAL':
						error = '手机号错误'
						break;
					case 'isv.MOBILE_COUNT_OVER_LIMIT':
						error = '手机号超出当天发送限制'
						break;
					case 'isv.BLACK_KEY_CONTROL_LIMIT':
						error = '黑名单管控'
						break;
					case 'isv.BUSINESS_LIMIT_CONTROL':
						error = '您发送短信过于频繁,请稍后再试'
						break;
					default:
						error = '短信发送失败'
						break;
				}
				resolve(ServiceResult.getFail(error));
			});
		});

	}

}
const smsRest = new SmsRest();
export default smsRest;