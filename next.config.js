const webpack = require('webpack')
const withCss = require('@zeit/next-css')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

const config = require('./config')

//解决nextjs不支持引入css文件的问题
if(typeof require !== 'undefined') {
    require.extensions['.css'] = file => {}
}

const configs = {
    disDir: 'dist',
    pageExtensions: ['jsx', 'js'],
    publicRuntimeConfig: {
        GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
        OAUTH_URL: config.OAUTH_URL
    },
    webpack(config) {
        // console.log('webpack:::', config)
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
        return config
    },
}

module.exports = withBundleAnalyzer(withCss({
    ...configs,
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html'
        },
        browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html'
        }
    }
}))