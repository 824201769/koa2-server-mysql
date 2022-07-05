import { cache, ServiceResult } from '../common';
import env from '../config/env';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');
import crypto from 'crypto';
var COS = require('cos-nodejs-sdk-v5');
import util from '../util/util';

const client = new COS({
  // 必选参数
  SecretId: env.SecretId,
  SecretKey: env.SecretKey,
});

var TaskId;

class UploadService {
  // 批量删除资源
  async deleteObject(list: any = []) {
    for (let index = 0; index < list.length; index++) {
      this.deleteFile(list[index]).then();
    }
  }
  async deleteFile(key: any) {
    let that = this;
    client.getBucket(
      {
        Bucket: env.Bucket,
        Region: env.Region,
        Prefix: key,
        MaxKeys: 1000,
      },
      function (listError: any, listResult: { NextMarker: any; Contents: any[]; IsTruncated: string }) {
        if (listError) return console.log('list error:', listError);
        var nextMarker = listResult.NextMarker;
        var objects = listResult.Contents.map(function (item) {
          return { Key: item.Key };
        });
        client.deleteMultipleObject(
          {
            Bucket: env.Bucket,
            Region: env.Region,
            Objects: objects,
          },
          function (delError: any, deleteResult: any) {
            if (delError) {
              console.log('delete error');
              console.log('delete stop');
            } else {
              console.log('delete ok');
              if (listResult.IsTruncated === 'true') {
                that.deleteObject(nextMarker);
              } else console.log('delete complete');
            }
          }
        );
      }
    );
  }
  // toImg
  async pdfToImages(fileName: string, imgName: string) {
    if (!fileName) {
      ServiceResult.getFail('文件名为空');
      return;
    }
    let data = util.getAuth({
      SecretId: env.SecretId,
      SecretKey: env.SecretKey,
      method: 'POST',
      pathname: '/doc_jobs',
    });
    let body =
      `<?xml version="1.0" encoding="UTF-8" ?>
      <Request>
     <Tag>DocProcess</Tag>
     <Input>
       <Object>${fileName}</Object>
     </Input>
     <Operation>
       <Output>
         <Region>${env.Region}</Region>
         <Bucket>${env.Bucket}</Bucket>` +
      `<Object>${imgName}/${imgName}-` +
      '${Number}.png</Object>' +
      `  </Output>
         <DocProcess>
            <StartPage>1</StartPage>
            <EndPage>-1</EndPage>
            <TgtType>png</TgtType>
            <Quality>60</Quality>
         </DocProcess>
       </Operation>
       <QueueId>${env.QueueId}</QueueId>
       </Request>`;

    axios.defaults.headers.common['Authorization'] = data;
    return new Promise((resolve, reject) => {
      axios
        .post('https://access-1306664842.ci.ap-shanghai.myqcloud.com/doc_jobs', body, {
          headers: {
            Date: new Date().toUTCString(),
            'Content-Type': 'application/xml',
          },
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          resolve(err);
        });
    });
  }
  // 获取 连接
  @cache({ prefix: 'file', keyExpress: '${args[0]}', expiresIn: 41200 })
  async getUrl(key: string) {
    if (!key) {
      return ServiceResult.getFail('Key 不可以为空');
    }
    let url = await new Promise((resolve, reject) => {
      let data = client.getObjectUrl({
        Query: {
          'response-cache-control': 'private, max-age=86400',
        },
        Bucket: env.Bucket /* 必须 */,
        Region: env.Region,
        Key: key,
        Sign: true /* 获取不带签名的对象URL */,
        Expires: 43200,
      });
      resolve(data);
    });
    return ServiceResult.getSuccess(url);
  }

  // 上传预签名
  async getObjectUrl(lastName: string, Bucket: string, Region: string) {
    let name_ = uuidv4().toString();
    let name = name_.replace(/-/g, '');
    let nameLastName = name + lastName;
    let data: any = await new Promise((resolve, reject) => {
      client.getObjectUrl(
        {
          Bucket: Bucket /* 必须 */,
          Region: Region,
          Method: 'PUT',
          Key: nameLastName,
          Sign: true,
          Expires: 43200,
        },
        function (err: any, data: any) {
          if (err) {
            resolve({ success: false, mes: err });
          } else {
            let item: any = {
              success: true,
              data: {
                url: data.Url,
                name: nameLastName,
              },
            };
            resolve(item);
          }
        }
      );
    });
    if (data.success) {
      return ServiceResult.getSuccess(data.data);
    } else {
      return ServiceResult.getFail(data.mes);
    }
  }
}
const uploadService = new UploadService();
export default uploadService;
