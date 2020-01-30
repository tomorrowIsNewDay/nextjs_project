//next 已经在全局配置过，所以不需要引用
// import React from 'react' 

import getConfig from 'next/config'
const api = require('../lib/api')

import { connect } from 'react-redux'

const { publicRuntimeConfig } = getConfig()

import { useEffect } from "react"
import axios from 'axios'
import { Button, Icon } from 'antd'

// console.log('publicRuntimeConfig:::', publicRuntimeConfig)

function Index ({ userRepos, userStaredRepos, user }) {
    console.log('userRepos:::', userRepos, userStaredRepos)

    // useEffect(() => {
    //     axios.post('/github/test', {test: 123})
    // })
    if(!user || !user.id) {
        return <div className='root'>
            <p>亲，您还没有登录哦～</p>
            <Button type='primary' href={publicRuntimeConfig.OAUTH_URL}>点击登录</Button>
            <style jsx>{`
                .root{
                    height: 400px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </div>
    }
    return (
        <div className='root'>
            <div className='user-info'>
                <img src={user.avatar_url} alt="user avatar" className='avatar' />
                <span className='login'>{ user.login }</span>
                <span className='name'>{ user.name }</span>
                <span className='bio'>{ user.bio }</span>
                <p className='email'>
                    <Icon type='mall' style={{marginRight: 10}}></Icon>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
            </div>
            <div className='user-repos'>
                <p>user-repos</p>
            </div>
            <style jsx>{`
                .root{
                    display: flex;
                    align-items: flex-start;
                    padding: 20px 0;
                }
                .user-info{
                    width: 200px;
                    margin-right: 40px;
                    flex-shrink: 0;
                    dispaly: flex;
                    flex-direction: column;
                }
                .login{
                    font-weight: 800;
                    font-size: 20px;
                    margin-top: 20px;
                }
                .name{
                    font-size: 16px;
                    color: #777;
                }
                .bio{
                    margin-top: 20px;
                    color: #333;
                }
                .avatar{
                    width: 100%;
                    border-radius: 100%
                }
            `}</style>
        </div>
    )
}

Index.getInitialProps = async({ctx, reduxStore}) => {
    
    // const result = await api.request({
    //     url: '/search/repositories?q=react'
    // }, ctx.req, ctx.res)       
    
    const user = reduxStore.getState().user
    if(!user || !user.id){
        return {
            isLogin: false
        }
    }

    
    const userRepos = await api.request({
        url: '/user/repos'
    }, ctx.req, ctx.res)  
    
    const userStaredRepos = await api.request({
        url: '/user/starred'
    }, ctx.req, ctx.res)  
    
    
    return {
        isLogin: true,
        userRepos: userRepos.data,
        userStaredRepos: userStaredRepos.data
    }                    
}

export default connect(
    function mapState(state){
        return {
            user: state.user
        }
    }
)(Index)
// export default ()=> {

//     useEffect( () => {
//         axios.get('/api/user/info').then(resp => {
//             console.log(resp)
//         })
//     }, [] )

//     return (
//             <>  
//                 <a href={publicRuntimeConfig.OAUTH_URL}>login</a>
//                 <style jsx>
//                     {
//                     `
//                     span{
//                         color: red
//                     }
//                     `
//                     }
//                 </style>
//             </>
//         )
// }