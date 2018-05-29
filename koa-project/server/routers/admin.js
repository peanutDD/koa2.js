/**
 * 管理员用户子路由
 */
/* jshint esversion: 6 */

const router = require('koa-router')()
const admin = require('./../controllers/admin')

module.exports = router.get( '/', admin.indexPage )