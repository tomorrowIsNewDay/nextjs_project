//next 已经在全局配置过，所以不需要引用
// import React from 'react' 

import getConfig from 'next/config'
const api = require('../lib/api')

const { publicRuntimeConfig } = getConfig()

import { useEffect } from "react"
import axios from 'axios'

// console.log('publicRuntimeConfig:::', publicRuntimeConfig)

function Index () {
    useEffect(() => {
        axios.post('/github/test', {test: 123})
    })

    return <span>index</span>
}

Index.getInitialProps = async({ctx}) => {
    
    const result = await api.request({
        url: '/search/repositories?q=react'
    }, ctx.req, ctx.res)                   
    return {
        data: result.data
    }                    
}

export default Index
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