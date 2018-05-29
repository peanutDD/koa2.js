
/* jshint esversion: 6 */

const Koa = require('koa');
const views = require('koa-views');
const path = require('path');
// const convert = require('koa-convert');
const static = require('koa-static');
const {uploadFile} = require('./file-upload-async');

const app = new Koa();

/*=============================================
=            使用第三方中间件 start            =
=============================================*/

app.use(views(path.join(__dirname, './view'), {
    extension: 'ejs'
}));

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static';
// 由于koa-static目前不支持koa2
// 所以只能用koa-convert封装一下
// app.use(static(
//     path.join(__dirname, staticPath)
// ));
/*=====      End of 使用第三方中间件      ======*/

console.log(path.join(__dirname, './view'));
console.log(path.join(__dirname, staticPath));

app.use( async (ctx) => {
  if ( ctx.url === '/' && ctx.method === 'GET' ) {
    let title = 'upload pic async';
    console.log('666666666');
    await ctx.render('upload-async', {
      title,
    });
  } else if ( ctx.url === '/api/picture/upload.json' && ctx.method === 'POST' ) {
    // 上传文件请求处理
    let result = { success: false };
    let serverFilePath = path.join( __dirname, 'static/image');

    // 上传文件事件
    result = await uploadFile( ctx, {
      fileType: 'album',
      path: serverFilePath
    });
    ctx.body = result;
  } else {
    // 其他请求显示404
    ctx.body = '<h1>404！！！ o(╯□╰)o</h1>';
  }

})

app.listen(8080, () => {
  console.log('[demo] upload-pic-async is starting at port 8080')
})
