const Koa = require('koa');
const path = require('path');
const views = require('koa-views');

const app = new Koa();

const {uploadFile} = require('./file-upload');

app.use(views(path.join(__dirname, './view'),{
    extension: 'ejs'
}));
app.use(async (ctx) => {
    if (ctx.url === '/' && ctx.method === 'GET') {
        // 当GET请求时候返回表单页面
        let html = `
            <h1>koa2 upload demo</h1>
                <form method="POST" action="/upload.json" enctype="multipart/form-data">
                <p>file upload</p>
                <span>picName:</span><input name="picName" type="text" /><br/>
                <input name="file" type="file" /><br/><br/>
                <button type="submit">submit</button>
            </form>`

        ctx.body = html;
    } else if (ctx.url === '/upload.json' && ctx.method === 'POST') {

        // 上传文件请求处理
        let success = {success: false};
        let serverFilePath = path.join(__dirname, 'upload-files');

        // 上传文件事件
        result = uploadFile(ctx, {
            fileType: 'album',
            path: serverFilePath
        });

        ctx.body = await result;

    } else {
        // 其他请求显示404
        await ctx.render('404');
    }
})

app.listen(3000, () => {
    console.log('[demo] file-upload-simple is starting at port 3000')
})