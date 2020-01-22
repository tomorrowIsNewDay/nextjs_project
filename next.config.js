const withCss = require('@zeit/next-css')

const config = require('./config')

//解决nextjs不支持引入css文件的问题
if(typeof require !== 'undefined') {
    require.extensions['.css'] = file => {}
}

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'

const configs = {
    disDir: 'dist',
    pageExtensions: ['jsx', 'js'],
    publicRuntimeConfig: {
        GITHUB_OAUTH_URL,
        OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${config.github.client_id}&scope=${SCOPE}`
    }
}

module.exports = withCss({
    ...configs
})