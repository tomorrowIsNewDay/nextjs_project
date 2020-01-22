module.exports = {
    github: {
        client_id: '7799f3612b93e2f2097f',
        client_secret: 'f48c6f3ce71c0983dea21a9b39baca72ec6b5af7',
        request_toke_url: 'https://github.com/login/oauth/access_token'
    }
}

//跳转授权页，并携带相应信息，client_id 一定要有，scope代表授权的范围，repo代表仓库信息，user代表用户信息
//https://github.com/login/oauth/authorize?client_id=7799f3612b93e2f2097f&scope=user

// 用户确认授权后，跳回redirect_url,并携带code
// http://localhost:3000/auth?code=88a8994622cdaa70cae4

// 获取token
// https://github.com/login/oauth/access_token
// body:{
//  	"client_id": "7799f3612b93e2f2097f",
// 	    "client_secret": "f48c6f3ce71c0983dea21a9b39baca72ec6b5af7",
// 	    "code": "5af57aad7af35e9893b1" 
//      }

// respose
// access_token=30ed10d242ac81ec29b6ed3774324d26ef1c2859&scope=repo%2Cuser&token_type=bearer

// 根据token 获取信息