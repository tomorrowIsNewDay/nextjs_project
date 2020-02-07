const axios = require('axios')
const github_base_url = 'https://api.github.com'
const { requestGithub } = require('../lib/api')

module.exports = (server) => {
    server.use(async (ctx, next) => {
        const path = ctx.path
        if(path.startsWith('/github/')) {
            // console.log('ctx.request.body:::', ctx.request.body)
            const githubAuth = ctx.session && ctx.session.githubAuth || {}
            let headers = {}
            // 设置token
            if(githubAuth.access_token) {
                headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
            }

            const result = await requestGithub(
                            ctx.method, 
                            ctx.url.replace('/github/', '/'), 
                            ctx.request.body || {},  
                            headers
                )
            ctx.status = result.status
            ctx.body = result.body
            ctx.set('Content-Type', 'application/json')
        }else{
            await next()
        }
    })
}

// module.exports = (server) => {
//     server.use(async (ctx, next) => {
//         const path = ctx.path
//         if(path.startsWith('/github/')) {
//             const githubAuth = ctx.session.githubAuth
//             const githubPath = `${github_base_url}${ctx.url.replace('/github/', '/')}`
            
//             const token = githubAuth && githubAuth.access_token
//             let headers = {}
//             // 设置token
//             if(token) {
//                 headers['Authorization'] = `${githubAuth.token_type} ${token}`
//             }

//             try{
//                 const result = await axios({
//                     method: 'GET',
//                     url: githubPath,
//                     headers
//                 })
//                 if(result.status === 200) {
//                     ctx.body = result.data
//                     ctx.set('Content-Type', 'application/json')
//                 }else{
//                     ctx.status = result.status
//                     ctx.body = {
//                         success: false
//                     }
//                     ctx.set('Content-Type', 'application/json')
//                 }
//             }catch(e){
//                 console.error(e)
//                 ctx.status = result.status
//                 ctx.body = {
//                     success: false
//                 }
//                 ctx.set('Content-Type', 'application/json')
//             }
//         }else{
//             await next()
//         }
//     })
// }