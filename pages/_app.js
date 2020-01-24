import App, { Container } from 'next/app'
import { Provider } from 'react-redux'

import Layout from '../components/Layout'
import 'antd/dist/antd.css'
import WithRedux from '../lib/whith-redux'

class MyApp extends App {

    // 数据获取
    static async getInitialProps(ctx) {
        const { Component } = ctx
        console.info('MyApp app:::', Component)
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
                    <Layout>
                        <Component {...pageProps}/>
                    </Layout>    
                </Provider> 
            </Container>
        )
    }
}

export default WithRedux(MyApp)