const axios = require('axios')
const config = require('../config')

const {client_id, client_secret, request_toke_url} = config.github
// console.log(request_toke_url,client_secret, 'request_toke_url:::')
module.exports = (server) => {
    server.use(async (ctx, next) => {
        //http://localhost:3000/auth?code=bb678db6ea1abdb72fa4

        if(ctx.path === '/auth') {
            const code = ctx.query.code
            // 获取code,有则 发送请求，获取token
            if(!code) {
                ctx.body = 'code not exist'
                return
            }

            const result = await axios({
                method: 'POST',
                url: request_toke_url,
                data: {
                    client_id,
                    client_secret,
                    code
                },
                headers: {
                    Accept: 'application/json'
                }
            })

            if(result.status === 200 && (result.data && !result.data.error)) {
                ctx.session.githubAuth = result.data
                
                const { access_token, token_type } = result.data
                //根据token获取用户信息
                const userInfoResp = await axios({
                    method: 'GET',
                    url: 'https://api.github.com/user',
                    headers: {
                        'Authorization': `${token_type} ${access_token}`
                    }
                })
                // console.log(userInfoResp, "userinforesp:::")
                // 用户信息写入session
                ctx.session.userInfo = userInfoResp.data
                ctx.redirect(ctx.session && ctx.session.urlBeforeOAuth || '/')
                ctx.session.urlBeforeOAuth = ''
            }else{
                const errorMsg = result.data && result.data.error
                ctx.body = `request token failed${errorMsg}`
            }

        }else{
            await next()
        }
    })

    server.use(async (ctx, next) => {
        const path = ctx.path
        const method = ctx.method
        if( path === '/logout' && method === 'POST' ) {
            ctx.session = null //清空session
            ctx.body = 'logout success'
        }else{
            await next()
        }
    })

    // 在登录前，预存当前路由，登录成功后跳转当前路由
    server.use(async (ctx, next) => {
        const path = ctx.path
        const method = ctx.method
        if( path === '/prepare-auth' && method === 'GET' ) {
            const { url } = ctx.query
            ctx.session.urlBeforeOAuth = url
            // ctx.body = 'ready'
            ctx.redirect(config.OAUTH_URL)
        }else{
            await next()
        }
    })
}