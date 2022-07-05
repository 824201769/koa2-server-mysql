const fs = require('fs');
//删除文件及文件夹
function delDir(logpath: string) {
  let files = [];
  if (fs.existsSync(logpath)) {
    files = fs.readdirSync(logpath);
    files.forEach((file: any, index: any) => {
      let curPath: string = logpath + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(logpath); // 删除文件夹自身
  }
}
export { delDir };
