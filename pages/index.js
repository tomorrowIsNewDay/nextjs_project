//next 已经在全局配置过，所以不需要引用
// import React from 'react' 

import getConfig from 'next/config'
const api = require('../lib/api')

import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
import LRU from 'lru-cache'

// 设置缓存 时效
// 10分钟内 未使用会被删除,指的是没有使用cache.get()调用
// 底层是使用 settimeout，定时器
const cache = new LRU({
    maxAge: 1000 * 60 * 10
})

const { publicRuntimeConfig } = getConfig()
// 本地缓存，避免tab 切换 重新获取数据
// 模块全局作用域，服务端渲染应避免
let cachedUserRepos, cachedUserStaredRepos
const isServer = typeof window === 'undefined'

import { useEffect } from "react"
import axios from 'axios'
import { Button, Icon, Tabs } from 'antd'
import Repo from '../components/Repo'

function Index ({ userRepos, userStaredRepos, user, router }) {
    console.log('userRepos:::', userRepos, userStaredRepos)

    const tabKey = router.query.key || '1'

    const handleTabChange = (activeKey) => {
        Router.push(`/?key=${activeKey}`)
    }
    useEffect(() => {
        if(!isServer) {
            // cache
            if(userRepos){
                cache.set('userRepos', userRepos)
            }
            if(userStaredRepos) {
                cache.set('userStaredRepos', userStaredRepos)
            }
            
            // cachedUserRepos = userRepos
            // cachedUserStaredRepos = userStaredRepos
        } 
    }, [userRepos, userStaredRepos])
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
                <Tabs 
                    defaultActiveKey={tabKey} 
                    onChange={handleTabChange}
                    animated={false}>
                    <Tabs.TabPane tab='你的仓库' key='1'>
                    { userRepos && userRepos.map(repo => <Repo repo={repo} key={repo.id}/>) }  
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='你关注的仓库' key='2'>
                    { userStaredRepos && userStaredRepos.map(repo => <Repo repo={repo} key={repo.id}/>) }  
                    </Tabs.TabPane>
                </Tabs>
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
                .user-repos {
                    flex-grow: 1;
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

    if (!isServer) {
        if(cache.get('userRepos') && cache.get('userStaredRepos')) {
            return {
                userRepos: cache.get('userRepos'),
                userStaredRepos: cache.get('userStaredRepos')
            }
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

export default withRouter(connect(
    function mapState(state){
        return {
            user: state.user
        }
    }
)(Index))


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