import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'

import Layout from '../components/Layout'
import 'antd/dist/antd.css'
import WithRedux from '../lib/whith-redux'
import PageLoading from '../components/PageLoading'

class MyApp extends App {
    state = {
        loading: false
    }

    startLoading = () => {
        this.setState({
            loading: true
        })
    }   
    stopLoading = () => {
        this.setState({
            loading: false
        })
    }  

    componentDidMount() {
        Router.events.on('routeChangeStart', this.startLoading)
        Router.events.on('routeChangeComplete', this.stopLoading)
        Router.events.on('routeChangeError', this.stopLoading)

        // axios.get('/github/search/repositories?q=react')
        //     .then(resp => {
        //         console.log('github:::', resp)
        //     })
    }

    componentWillUnmount() {
        Router.events.off('routeChangeStart', this.startLoading)
        Router.events.off('routeChangeComplete', this.stopLoading)
        Router.events.off('routeChangeError', this.stopLoading)
    }

    // 数据获取
    static async getInitialProps(ctx) {
        const { Component } = ctx
        console.info('MyApp app:::', Component,ctx)
        let pageProps
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx)
        }
        return {
            pageProps
        }
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props
        // console.info('reduxStore app:::', reduxStore)

        return ( 
            <Container>
                <Provider store={reduxStore}>
                    { this.state.loading ? <PageLoading /> : null }
                    <Layout>
                        {/* <Link href='/'>
                            <a>index</a>
                        </Link>
                        <Link href='/detail'>
                            <a>detail</a>
                        </Link> */}
                        <Component {...pageProps}/>
                    </Layout>    
                </Provider> 
            </Container>
        )
    }
}

export default WithRedux(MyApp)