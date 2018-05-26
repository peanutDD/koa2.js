/*
 * @Author: Goodvv
 * @Date: 2018-05-21 10:46:19
 * @LastEditors: Goodvv
 * @LastEditTime: 2018-05-21 17:32:07
 * @Description: 
 */
/* jshint esversion: 6 */


/*=============================================
=  Cookie 在 Web 应用中经常承担标识请求方身份的功能，
   但是cookie信息会被储存在浏览器本地或硬盘中，这样会有安全问题，如果有人能够访问你的电脑就能分析出你的敏感信息，用户名、密码等等。为了解决这个隐患，所以 Web 应用在 Cookie 的基础上封装了 Session 的概念，专门用做用户身份识别。
   既然服务器渲染又需要用户登录功能，那么用session去记录用户登录态是必要的
   koa2原生功能只提供了cookie的操作，但是没有提供session操作。session就只能自己实现或者通过第三方中间件实现。
   但是基于koa的egg.js框架内置了 Session 插件，给我们提供了 ctx.session 来访问或者修改当前用户 Session 。----> cookie & session
   在koa2中实现session的方案有：
        如果session数据量很小，可以直接存在内存中
        如果session数据量很大，则需要存储介质存放session数据
=
=============================================*/


/* 数据库存储方案 */


/*=====  储存在ＭySQL

需要用到中间件:

koa-session-minimal 适用于koa2 的session中间件，提供存储介质的读写接口 。
koa-mysql-session 为koa-session-minimal中间件提供MySQL数据库的session数据读写操作。
然后，我们将将sessionId和对应的数据存到数据库

将数据库的存储的sessionId存到页面的cookie中
根据cookie的sessionId去获取对于的session信息

======*/


/*=====  储存在redis
在express中我们用的是express-session,那么在koa2中用的是哪些模块：

koa2-cookie-session
koa-session-redis
ioredis
注意：一旦选择了将 Session 存入到外部存储中，就意味着系统将强依赖于这个外部存储，当它挂了的时候，我们就完全无法使用 Session 相关的功能了。
     因此我们更推荐大家只将必要的信息存储在 Session 中，保持 Session 的精简并使用默认的 Cookie 存储，用户级别的缓存不要存储在 Session 中。
======*/





const Koa = require('koa');
const session = require('koa-session-minimal');
const MysqlSession = require('koa-mysql-session');

const app = new Koa();

// TODO:配置存储session信息的mysql

let store = new MysqlSession({
    user: 'root',
    password: '2486',
    database: 'koa_session',
    host: '127.0.0.1'
});

// TODO:存放sessionId的cookie配置

let cookie = {
    maxAge: '', // cookie有效时长
    expires: '', // cookie失效时间
    path: '', // 写cookie所在的路径
    domain: 'localhost', // 写cookie所在的域名
    httpOnly: '', // 是否只用于http请求中获取
    overwrite: '',  // 是否允许重写
    secure: '',
    sameSite: '',
    signed: '',
};

// TODO:使用session中间件

app.use(session({
    key: 'SESSION_ID',
    store: store,
    cookie: cookie
}))

app.use(async (ctx)=> {
    
    // TODO:设置session
    if (ctx.url === '/set') {
        ctx.session = {
            user_id: Math.random().toString(36).substr(2),
            count: 0
        }

        ctx.body = ctx.session;
    } else if (ctx.url === '/') {

        // TODO: 读取session信息
        ctx.session.count = ctx.session.count + 1;
        ctx.body = ctx.session;
    }
});

app.listen(3000)
console.log('[demo] session is starting at port 3000')