import App, { Container } from 'next/app'
import { Provider } from 'react-redux'

import Layout from '../components/Layout'
import 'antd/dist/antd.css'
import WithRedux from '../lib/whith-redux'

class MyApp extends App {

    // 数据获取
    static async getInitialProps(ctx) {
        const { Component } = ctx
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
                <Layout>
                    <Provider store={reduxStore}>
                        <Component {...pageProps}/>
                    </Provider>
                </Layout>
            </Container>
        )
    }
}

export default WithRedux(MyApp)