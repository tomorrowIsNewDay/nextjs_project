//next 已经在全局配置过，所以不需要引用
// import React from 'react' 

import { Button } from 'antd' 
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

// console.log('publicRuntimeConfig:::', publicRuntimeConfig)

export default ()=> (
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