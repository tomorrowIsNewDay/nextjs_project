import withRepoBasic from '../../components/with-repo-basic'
import api from '../../lib/api'
import { useState, useCallback, useEffect } from 'react'

import dynamic from 'next/dynamic'
import { Avatar, Button, Select, Spin } from 'antd'

import { getLastUpdated } from '../../lib/utils'

const MDRenderer = dynamic(
    () => import('../../components/MarkdownRenderer'),
    {
        loading: () => <p>Loading...</p>
    })

import SearchUser from '../../components/SearchUser'

const CACEH = {}
const isServer = typeof window === 'undefined'

function IssueDetail({issue}) {
    return (
        <div className='root'>
            <MDRenderer content={issue.body} />
            <div className='actions'>
                <Button href={issue.html_url} target='_blank'>打开Issue讨论页面</Button>
            </div>
            <style jsx>{`
                .root{
                    background: #fefefe;
                    padding: 20px;
                }
                .actions{
                    text-align: right
                }
            `}</style>
        </div>
    )
}

function IssueItem({issue}){
    const [showDetail, setShowDetail] = useState(false)

    const toggleShowDetail = useCallback(() => {
        // setShowDetail(!showDetail)
        // 避免闭包依赖，不用去依赖showDetail
        setShowDetail(detail => !detail)
    }, [])

    return (
        <div> 
            <div className='issue'>
                <Button type='primary' 
                    size='small' 
                    style={{position: 'absolute', top: 10, right: 10}}
                    onClick={toggleShowDetail}
                    >
                    { showDetail ? '隐藏':'查看'}
                </Button>
                <div className='avatar'>
                    <Avatar src={issue.user.avatar_url} shape='square' />
                </div>
                <div className='main-info'>
                    <h6>
                        <span>{ issue.title }</span>
                        { 
                            issue.labels.map(label => <Label label={label} key={label.id}/>)
                        }
                    </h6>
                    <p className='sub-info'>
                        <span>{ getLastUpdated(issue.updated_at) }</span>
                    </p>
                </div>
                { showDetail ? <IssueDetail issue={issue} /> : null }
            </div>
            <style jsx>{`
                .issue{
                    display: flex;
                    position: relative;
                    padding: 10px;
                }
                .issue:hover{
                    background: #fafafa;
                }
                .issue + .issue {
                    border-top: 1px solid #eee
                }
                .main-info > h6 {
                    max-width: 600px;
                    font-size: 16px;
                    padding-right: 40px;
                }
                .avatar{
                    margin-right: 20px;
                }
                .sub-info{
                    margin-bottom: 0;
                }
                .sub-info > span + span {
                    display: inline-block;
                    margin-left: 20px;
                    font-size: 12px;
                }
            `}</style>
        </div>
    )
}

const Option = Select.Option
function Label({label}) {
    return (
        <>
            <span className='label' style={{backgroundColor: `#${label.color}`}}>
                {label.name}
            </span>
            <style jsx>{`
                .label {
                    display: inline-block;
                    line-height: 20px;
                    margin-left: 15px;
                    padding: 3px;
                    border-radius: 3px;
                    font-size: 14px;
                }
            `}</style>
        </>
    )
}

function makeQuery(creator, state, labels) {
    let creatorStr = creator ? `creator=${creator}` : ''
    let stateStr = state ? `state=${state}` : ''
    let labelStr = ''
    if(labels && labels.length > 0) {
        labelStr = `labels=${labels.join(',')}`
    }

    const arr = []
    if(creatorStr) arr.push(creatorStr)
    if(stateStr) arr.push(stateStr)
    if(labelStr) arr.push(labelStr)

    return `?${arr.join('&')}`
}

function Issues({initialIssues, labels, owner, name}) {

    const [creator, setCreator] = useState()
    const [state, setState] = useState()
    const [label, setLabel] = useState([])
    const [issues, setIssues] = useState(initialIssues)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        if(!isServer){
            CACEH[`${owner}/${name}`] = labels
        }
    }, [labels, owner, name])

    const handleCreatorChange = useCallback((value) => {
        setCreator(value)
    }, [])

    const handleStateChange = useCallback((value) => {
        setState(value)
    }, [])

    const handleLabelChange = useCallback((value) => {
        setLabel(value)
    }, [])

    const handleSearch = useCallback(() => {
        setFetching(true)
        api.request({
            url: `/repos/${owner}/${name}/issues${makeQuery(
                creator,
                state,
                label
            )}`
        }).then(resp => {
            setFetching(false)
            setIssues(resp.data)
        }).catch(e => {
            setFetching(false)
            console.error(e)
        })
    }, [owner, name, creator, state, label])

    return (
        <div className='root'>
            <div className='search'>
                <SearchUser value={creator} onChange={handleCreatorChange}/>
                <Select 
                    placeholder='状态' 
                    style={{width: 200, marginLeft: 20}}
                    value={state} 
                    onChange={handleStateChange}>
                    <Option value='all'>all</Option>
                    <Option value='open'>open</Option>
                    <Option value='closed'>closed</Option>
                </Select>
                <Select 
                    mode='multiple'
                    placeholder='label' 
                    style={{flexGrow: 1, marginLeft: 20, marginRgith: 20}}
                    value={label} 
                    onChange={handleLabelChange}>
                    { labels.map(la => <Option value={la.name} key={la.key}>
                        {la.name}
                        </Option>) }
                </Select>
                <Button type='primary' disabled={fetching} onClick={handleSearch}>搜索</Button>
            </div>
            { fetching ? <div className='loading'><Spin /></div> :
            <div className='issues'>
                { issues.map(issue => <IssueItem issue={issue} key={issue.id}/>) }
            </div>
            }
            <style jsx>{`
                .issues {
                    border: 1px solid #eee;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    margin-top: 20px;
                }
                .search{
                    display: flex;
                }
                .loading {
                    height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    )
}

Issues.getInitialProps = async({ctx}) => {
    const { owner, name } = ctx.query

    // const issuesResp = await api.request({
    //     url: `/repos/${owner}/${name}/issues/`
    // }, ctx.req, ctx.res)

    // const labelsResp = await api.request({
    //     url: `/repos/${owner}/${name}/labels/`
    // }, ctx.req, ctx.res)

    const full_name = `${owner}/${name}`

    const fetchs = await Promise.all([
        await api.request({
            url: `/repos/${owner}/${name}/issues/`
        }, ctx.req, ctx.res),
        CACEH[full_name] ? Promise.resolve({data: CACEH[full_name]}) :
        await api.request({
            url: `/repos/${owner}/${name}/labels/`
        }, ctx.req, ctx.res)
    ])

    return {
        owner,
        name,
        initialIssues: fetchs[0].data,
        labels: fetchs[1].data
    }
}

export default withRepoBasic(Issues, 'issues')