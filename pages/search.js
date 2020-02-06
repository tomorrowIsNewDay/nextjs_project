import { withRouter } from 'next/router'
import { Row, Col, List, Pagination } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
const api = require('../lib/api')

import { useEffect, memo, isValidElement } from 'react'
import Repo from '../components/Repo'

import { cacheArray } from '../lib/repo-basic-cache'

const isServer = typeof window === 'undefind'

const SearchFakeJson = require('../json/search.json')

const LANGUAGE = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']
const SORT_TYPES = [{
    name: 'Best Match'
},{
    name: 'Most Stars',
    value: 'stars',
    order: 'desc'
},{
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
},{
    name: 'Most Stars',
    value: 'forks',
    order: 'desc'
},{
    name: 'Fewest Stars',
    value: 'forks',
    order: 'asc'
}]
/** 
 * sort: 排序方式
 * order: 排序顺序
 * lang: 语言
 * page: 分页
*/

const selectedItemStyle = {
    borderLeft: '2px solid #e36209',
    fontWeight: 100
}

function noop() {}

// 公共组件
const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
    // const doSearch = () => {
    //     Router.push({
    //         pathname: '/search',
    //         query: {
    //             query,
    //             lang,
    //             sort,
    //             order
    //         }
    //     })   
    // }
    // return <a onClick={doSearch}>{name}</a>

    // ?q=react+language:javascript&sort&stars&order=desc&page=2
    let queryString = `?query=${query}`
    if(lang){
        queryString += `&lang:${lang}`
    }
    if(sort){
        queryString += `&sort=${sort}&order=${order || 'desc'}`
    }
    if(page) {
        queryString += `&page=${page}`
    }

    return <Link href={`/search${queryString}`}>
                { isValidElement(name) ? name :  
                    <a>{name}</a>
                }
            </Link>
})

function Search({router, repos}) {
    // console.log('repos::', repos)

    const { sort, order, lang, query, page } = router.query
    console.log('lang::', router.query)

    useEffect( () => {
        if(!isServer) cacheArray(repos.items)
    })

    // return <span>{ router.query.query }</span>
    return (
        <div className='root'>
            <Row gutter={20}>
                <Col span={6}>
                    <List 
                        bordered 
                        header={<span className='list-header'>语言</span>} 
                        style={{marginBottom: 20}}
                        dataSource={LANGUAGE}
                        renderItem={item => {
                            const selected = lang === item
                            return (
                                <List.Item style={selected ? selectedItemStyle : null}>
                                    { selected ? <span>{item}</span> : 
                                    <FilterLink 
                                        lang={item}
                                        query={query}
                                        order={order}
                                        sort={sort}
                                        name={item}
                                        page={page}
                                    />}
                                   {/* <Link href='/search'> <a>{item}</a></Link> */}
                                </List.Item>
                            )
                        }}
                        />
                    <List
                        bordered
                        header={<span className='list-header'>排序</span>}
                        dataSource={SORT_TYPES}
                        renderItem={item => {
                            let selected = false
                            if(item.name === 'Best Match' && !sort){
                                selected = true
                            }else if(item.value === sort && item.order === order) {
                                selected = true
                            }
                            return (
                                <List.Item style={selected ? selectedItemStyle : null}>
                                    {/* <a onClick={() => doSearch({query,
                                                                lang,
                                                                sort: item.value || '',
                                                                order: item.order || ''})}>
                                    {item.name}</a> */}
                                    { selected ? <span>{item.name}</span> :  
                                    <FilterLink 
                                        lang={lang}
                                        query={query}
                                        order={item.order || ''}
                                        sort={item.value || ''}
                                        name={item.name}
                                        page={page}
                                    />}
                                    {/* <Link href='/search'><a>{item.name}</a></Link> */}
                                </List.Item>
                            )
                        }}
                    />    
                </Col>
                <Col span={18}>
                    <h3 className='repos-title'>{repos.total_count} 个仓库</h3>
                    {
                        repos.items && repos.items.map(repo => <Repo repo={repo} key={repo.id}/>)
                    }
                    <div className='pagination'>
                        <Pagination 
                            pageSize={30}
                            current={Number(page) || 1}
                            total={repos.total_count}
                            onChange={noop}
                            itemRender={(page, type, ol) => {
                                const p = type === 'page' ? page : type === 'prev' ? page - 1 : page + 1
                                const name = type === 'page' ? page : ol
                                return <FilterLink 
                                        lang={lang}
                                        query={query}
                                        order={order}
                                        sort={sort}
                                        name={name}
                                        page={p}
                                />
                            }}
                        />
                    </div>
                </Col>
            </Row>
            <style jsx>{`
                .root {
                    padding: 20px 0;
                }
                .list-header {
                    font-weight: 800,
                    font-size: 16px
                }
                .repos-title {
                    border-bottom: 1px solid #eee;
                    font-size: 24px;
                    line-height: 50px;
                }
                .pagination{
                    padding: 20px;
                    text-align: center;
                }
            `}</style>
        </div>
    )
}

Search.getInitialProps = async ({ctx}) => {
    const { query, sort, lang, order, page } = ctx.query
    
    if(!query) {
        return {
            repos: {
                total_count: 0
            }
        }
    }
    // ?q=react+language:javascript&sort=stars&order=desc&page=2
    // https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc
    let queryString = `?q=${query}`
    if(lang){
        queryString += `+language:${lang}`
    }
    if(sort){
        queryString += `&sort=${sort}&order=${order || 'desc'}`
    }
    if(page){
        queryString += `&page=${page}`
    }
    const result = api.request({
        url: `/search/repositories${queryString}`
    }, ctx.req, ctx.res)
    return {
        repos: result.data || SearchFakeJson
    }
}

export default withRouter(Search)