
/* jshint esversion: 6 */

const inspect = require('util').inspect;
const path = require('path');
const fs = require('fs');
const os = require('os');
const Busboy = require('busboy');


/**
 * *同步创建文件目录
 * @param {string} dirname 目录绝对地址
 * @return {boolean} true 创建目录结果
 * 
 */

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;    
      }  
    }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string} true     文件后缀名
 */

function getSuffixName(filename) {
    let nameList = filename.split('.');
    return nameList[nameList.length - 1];      
}

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}         
 */

function uploadFile(ctx, option) {
    let req = ctx.req;
    let res = ctx.res;
    const busboy = new Busboy({
        
        // TODO: req为node原生请求
        headers: req.headers
        
    });

    // 获取文件类型

    let fileType = option.fileType || 'common';
    let filePath = path.join(option.path, fileType);
    let mkdirResult = mkdirsSync(filePath);

    return new Promise(function(resolve, reject) {
        console.log('file is uploading!!!');
        
        let result = {
            success: false,
            formData: {}
        };
        
        // 解析请求文件事件

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            let fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename);
            console.log('文件名： '+fileName);
            let _uploadFilePath = path.join(filePath, fileName);
            let saveTo = path.join(_uploadFilePath);

            // 文件保存到制定路径
            file.pipe(fs.createWriteStream(saveTo));

            // 文件写入事件结束
            file.on('end', function () {
                result.success = true;
                result.message = 'file uploads success 上传成功！';

                console.log('file uploads success 上传成功！');
                resolve(result);
            });
        });

        // 解析表单中其他字段信息

        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log(`表单字段数据 ${fieldname} value: ${inspect(val)}`);
            result.formData[fieldname] = inspect(val);
        });

        // 解析结束事件

        busboy.on('finish', function () {
            console.log('文件上传结束！');
            resolve(result);
        });

        busboy.on('error', function (err) {
            console.log(err);    
            reject(result);     
        });

        req.pipe(busboy);
    });
}

module.exports = {
    uploadFile
};