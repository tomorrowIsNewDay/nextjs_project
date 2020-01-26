const withCss = require('@zeit/next-css')

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
    }
}

module.exports = withCss({
    ...configs
})