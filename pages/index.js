//next 已经在全局配置过，所以不需要引用
// import React from 'react' 

import { Button } from 'antd' 

export default ()=> (
    <>
        <span>home page<Button>哈哈</Button></span>
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