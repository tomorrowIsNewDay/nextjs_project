const axios = require('axios')
const config = require('../config')

const {client_id, client_secret, request_toke_url} = config.github
console.log(request_toke_url,client_secret, 'request_toke_url:::')
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

            if(result.status === 200) {
                ctx.session.githubAuth = result.data
                ctx.redirect('/')

            }else{
                ctx.body = `request token failed`
            }

        }else{
            await next()
        }
    })
}