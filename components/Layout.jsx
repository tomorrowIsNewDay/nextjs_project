import { useState, useCallback } from 'react'

import Container from './Container'
import Link from 'next/link'
import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

import { connect } from 'react-redux'
import { logout } from '../store/store'
import axios from 'axios'
import { withRouter } from 'next/router'

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

function MyLayout({ children, user, logout, router }) {

    const [search, setSearch] = useState('')

    const handleChange = useCallback((event) => {
        setSearch(event.target.value)
    }, [setSearch])

    const handleSearch = useCallback(() => {}, [])

    // 登出
    const handleLogout = useCallback(() => {
        logout()
    }, [logout])

    const handleGotoOAuth = useCallback((e) => {
        e.preventDefault()

        axios.get(`/prepare-auth?url=${router.asPath}`).then(resp => {
            if(resp.status === 200) {
                location.href = publicRuntimeConfig.OAUTH_URL
            }else{
                console.log('prepare failed')
            }
        }).catch(e => {
            console.error(e)
        })
    }, [])

    const userDropDown = (
        <Menu>
            <Menu.Item>
                <a href="javascript:void(0)" onClick={handleLogout}>
                    登出
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <Layout>
            <Header>
                <Container renderer={<div className="header-inner"/>}>
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
                            {
                                user && user.id ? (
                                 <Dropdown overlay={userDropDown}>
                                     <a href='/'>
                                        <Avatar size={40} src={user.avatar_url} />
                                    </a>
                                 </Dropdown>  
                                ) : 
                                (
                                <Tooltip title="点击进行登录">
                                    <a
                                        href={`/prepare-auth?url=${router.asPath}`} 
                                        // onClick={handleGotoOAuth}
                                        >
                                        <Avatar size={40} icon='user' />
                                    </a>
                                </Tooltip>
                                )
                            }
                        </div>
                    </div>
                </Container>
            </Header>
            <Content> 
                <Container> {children} </Container>
            </Content>
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
                    .ant-layout-header{
                        padding-left: 0;
                        padding-right: 0
                    }
                `}
            </style>
        </Layout>
    )
}

export default connect(
    function mapState(state) {
        return {
            user: state.user
        }
    },
    function mapReducer(dispatch) {
        return {
            logout: () => dispatch(logout())
        }
    }
)(withRouter(MyLayout))