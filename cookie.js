/* jshint esversion: 6 */

// HTTP 请求都是无状态的，但是我们的 Web 应用通常都需要知道发起请求的人是谁。为了解决这个问题，
// HTTP 协议设计了一个特殊的请求头：Cookie。服务端可以通过响应头（set-cookie）将少量数据响应给客户端，浏览器会遵循协议将数据保存，并在下次请求同一个服务的时候带上（浏览器也会遵循协议，只在访问符合 Cookie 指定规则的网站时带上对应的 Cookie 来保证安全性）。
// cookie经常用于做登录信息的储存，当然我们在后端经常喜欢用它，在前端的单页应用一般喜欢用localstorage

// koa2 中操作的cookies是使用了npm的cookies模块，所以在读写cookie的使用参数与该模块的使用一致。
// 在设置 Cookie 时我们需要思考清楚这个 Cookie 的作用，它需要被浏览器保存多久？是否可以被 js 获取到？是否可以被前端修改？
// 在控制台的console中使用document.cookie可以打印出在页面的所有cookie（需要是httpOnly设置false才能显示）

const Koa = require('koa');
const app = new Koa();

app.use( async ( ctx ) => {

  if ( ctx.url === '/index' ) {

    
    /**
     * ctx.cookies.get(name, [options]) 读取上下文请求中的cookie
     * ctx.cookies.set(name, value, [options]) 在上下文中写入cookie
     *
     * @param {Number} maxAge: 设置这个键值对在浏览器的最长保存时间。是一个从服务器当前时刻开始的毫秒数。
     * @param { Date } expires: 设置这个键值对的失效时间，如果设置了 maxAge，expires 将会被覆盖。如果 maxAge 和 expires 都没设置，Cookie 将会在浏览器的会话失效（一般是关闭浏览器时）的时候失效。
     * @param {String} path: 设置键值对生效的 URL 路径，默认设置在根路径上（/），也就是当前域名下的所有 URL 都可以访问这个 Cookie。
     * @param {String} domain: 设置键值对生效的域名，默认没有配置，可以配置成只在指定域名才能访问。
     * @param {Boolean} httpOnly: 设置键值对是否可以被 js 访问，默认为 true，不允许被 js 访问。
     * @param {Boolean} secure: 设置键值对只在 HTTPS 连接上传输，框架会帮我们判断当前是否在 HTTPS 连接上自动设置 secure 的值。
     * @param {Boolean} overwrite: 表示是否覆盖以前设置的同名的cookie（默认是false），如果是true 在同一个请求中设置相同名称的s偶有cookie（不管路径或域）是否在设置此cookie时从 Set-Cookie 标头中过滤掉。
     */
    
    
    ctx.cookies.set(
      'cid', 
      'hello world',
      {
        domain: 'localhost',  // 写cookie所在的域名
        path: '/index',       // 写cookie所在的路径
        maxAge: 10 * 60 * 1000, // cookie有效时长
        expires: new Date('2018-05-25'),  // cookie失效时间
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
      }
    )

    ctx.body = 'cookie is ok';
  } else {
    ctx.body = 'hello world';
  }

})

app.listen(3000, () => {
  console.log('[demo] cookie is starting at port 3000')
})
