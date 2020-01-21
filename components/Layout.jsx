import { useState, useCallback } from 'react'

import Link from 'next/link'
import { Layout, Icon, Input, Avatar } from 'antd'

const { Header, Content, Footer } = Layout

const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20
}
const footerStyle = {
    textAlign: 'center'
}

export default ({ children }) => {

    const [search, setSearch] = useState('')

    const handleChange = useCallback((event) => {
        setSearch(event.target.value)
    }, [setSearch])

    const handleSearch = useCallback(() => {}, [])

    return (
        <Layout>
            <Header>
                <div className="header-inner">
                    <div className="header-left">
                        <div className="logo">
                            <Icon type='github' style={githubIconStyle}/>
                        </div>
                        <div>
                            <Input.Search 
                                placeholder='搜索仓库' 
                                value={search} 
                                onChange={handleChange}
                                onSearch={handleSearch}
                                />
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user">
                            <Avatar size={40} icon='user' />
                        </div>
                    </div>
                </div>
            </Header>
            <Content> {children} </Content>
            <Footer style={footerStyle}>
                Develop by lee_ming@<a href='mailto:602387427@qq.com'>602387427@qq.com</a>
            </Footer>
            <style jsx>
            { `
                .header-inner{
                    display: flex;
                    justify-content: space-between
                }  
                .header-left{
                    display: flex;
                    justify-content: flex-start
                }  

            `}
            </style>
            <style jsx global>
                {`
                    #__next{
                        height: 100%
                    }
                    .ant-layout{
                        height: 100%
                    }
                `}
            </style>
        </Layout>
    )
}