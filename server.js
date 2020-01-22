const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const session = require('koa-session')
const auth = require('./server/auth') 

//** redis */
const RedisSessionStore = require('./server/session-store')
const Redis = require('ioredis')

const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    db: 0
})

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
// 处理响应
const handle = app.getRequestHandler()

app.prepare().then(()=>{
    const server = new Koa()
    const router = new Router()

    server.keys = ['leemd mansdyd you man nin']
    const SEESION_CONFIG = {
        key: 'jid',
        // maxAge: 20 * 1000,
        store: new RedisSessionStore(redis)
    }
    // 使用session
    server.use(session(SEESION_CONFIG, server))

    //配置处理 github oauth 登录，获取token
    auth(server)

    // server.use(async (ctx, next) => {
    //     if(ctx.cookies.get('jid')){
    //         ctx.session = {}
    //     }
    //     await next()
    //     // ctx.session
    // })

    server.use(async (ctx, next) => {
        // if(!ctx.session.user){
        //     ctx.session.user = {
        //         name: 'leem',
        //         age: 23
        //     }
        // }else{
            // console.log('session is::', ctx.session)
        // }

        await next()
    })

    // 处理 路由映射 浏览器刷新 导致 404的bug
    router.get('a/:id', async(ctx) => {
        const id = ctx.params.id
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: {id}
        })
        ctx.respond = false //设置false,手动设置ctx.body,true 会自动默认相应
    })

    router.get('/api/user/info', async(ctx) => {
       const user = ctx.session.userInfo
       if(!user){
           ctx.status = 401
           ctx.body = 'need login'
       }else{
           ctx.body = user
           ctx.set('Content-Type', 'application/json')
       }
    })

    router.get('/set/user', async(ctx) => {
        ctx.session.user = {
            name: 'leem',
            age: 23
        }
        ctx.body = 'set session success'
    })

    server.use(router.routes())

    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        // ctx.cookies.set('id', index, {
        //     httpOnly: false//默认true
        // })
        // ctx.req 是node的 request 对象
        //  ctx.request是koa的 request对象
        // 这里是nextjs为了兼容多中node框架，所有采用的是node的对象
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.listen(3000, ()=>{
        console.log('koa server start')
    })
})
