const Koa = require('koa')
const next = require('next')
const Router = require('next/router')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
// 处理响应
const handle = app.getRequestHandler()

app.prepare().then(()=>{
    const server = new Koa()
    const router = new Router()

    // 处理 路由映射 浏览器刷新 导致 404的bug
    router.get('a/:id', async(ctx) => {
        const id = ctx.params.id
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: {id}
        })
        ctx.respond = false
    })
    server.use(router.routes())

    server.use(async (ctx, next) => {
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
