import React from 'react'
import createStore from '../store/store'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
    // console.log(createStore, typeof createStore, 'createStore:::')
    // 服务端需要每次都是初始化store
    if(isServer) {
        return createStore(initialState)
    }
    // 客户端则要保存stroe,不需要每次初始化
    if(!window[__NEXT_REDUX_STORE__]){
        window[__NEXT_REDUX_STORE__] = createStore(initialState)
    }
    return window[__NEXT_REDUX_STORE__]
}

export default Comp => {
   class WithReduxApp extends React.Component{
        constructor(props){
            super(props)
            this.reduxStore = getOrCreateStore(props.initialReduxState)
        }
        render() {
            const {Component, pageProps, ...rest} = this.props
            // console.log('WithReduxApp:::', Component, rest)
            return <Comp Component={Component} pageProps={pageProps} {...rest} reduxStore={this.reduxStore}/>
        }
   }
   WithReduxApp.getInitialProps = async (ctx) => {
        
        let reduxStore
        console.log('isServer:::', isServer)
        if(isServer) {
            const { req } = ctx.ctx
            const session = req.session

            if(true){
                reduxStore = getOrCreateStore({
                    user: session.userInfo
                })
            }else{
                reduxStore = getOrCreateStore()
            }
        }else{
            reduxStore = getOrCreateStore()
        }
    // console.log(reduxStore.getState(), 'reduxStore.getState:::::')
       let appProps = {}

       ctx.reduxStore = reduxStore

       if(typeof Comp.getInitialProps === 'function') {
           appProps = await Comp.getInitialProps(ctx)
       }
    //    console.log('initialReduxState:::', reduxStore.getState())

       return {
           ...appProps,
           initialReduxState: reduxStore.getState() //返回store数据，因为会虚列化成字符串，所以只返回数据，方法什么的通过contructor中的reduxStore返回
       }
   }

    return WithReduxApp
}
