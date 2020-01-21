import App, { Container } from 'next/app'

import 'antd/dist/antd.css'

class MyApp extends App {

    // 数据获取
    static async getInitialProps({Component, ctx}) {
        let pageProps
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx)
        }
        return {
            pageProps
        }
    }

    render() {
        const { Component, pageProps } = this.props
        return (
            <Container>
                <Component {...pageProps}/>
            </Container>
        )
    }
}

export default MyApp