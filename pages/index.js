//next 已经在全局配置过，所以不需要引用
// import React from 'react' 

import { Button } from 'antd' 
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

import { useEffect } from "react"
import axios from 'axios'

// console.log('publicRuntimeConfig:::', publicRuntimeConfig)

export default ()=> {

    useEffect( () => {
        axios.get('/api/user/info').then(resp => {
            console.log(resp)
        })
    }, [] )

    return (
            <>  
                <a href={publicRuntimeConfig.OAUTH_URL}>login</a>
                <style jsx>
                    {
                    `
                    span{
                        color: red
                    }
                    `
                    }
                </style>
            </>
        )
}