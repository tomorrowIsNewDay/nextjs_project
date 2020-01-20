const withCss = require('@zeit/next-css')
//解决nextjs不支持引入css文件的问题
if(typeof require !== 'undefined') {
    require.extensions['.css'] = file => {}
}

module.exports = withCss({})