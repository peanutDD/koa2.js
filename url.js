const Koa = require('koa');
const app = new Koa();

app.use(async(ctx) => {
    let url = ctx.request.url;
    ctx.body = url;
})

app.listen(4000);
console.log('demo the url is starting at port 4000');