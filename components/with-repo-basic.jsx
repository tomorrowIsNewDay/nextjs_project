
import Repo from './Repo'
import Link from 'next/link'
import api from '../lib/api'
import { withRouter } from 'next/router'
import { useEffect } from 'react'

import { get, cache } from '../lib/repo-basic-cache'
const isServer = typeof window === 'undefind'

export default function (Comp, type='index'){
    function makeQuery(queryObject) {
        const query = Object.entries(queryObject)
                        .reduce((result, entry) => {
                            result.push(entry.join('='))
                            return result
                        }, []).join('&')
        return `?${query}`                
    }
    
    function WithDetail({ repoBasic, router, ...rest }) {
        console.log('repoBasic:::', repoBasic)

        useEffect( ()=> {
            if(!isServer) {
                cache(repoBasic)
            }
        } )

        const query = makeQuery(router.query)
        return (
            <div className='root'>
                <div className='repo-basic'>
                    <Repo  repo={repoBasic} />
                    <div className='tabs'>
                        { type === 'index' ? <span className='tab'>Readme</span> :
                        <Link href={`/detail${query}`}>
                            <a className='tab index'>Readme</a>
                        </Link>
                        }
                        { type === 'issues' ? <span className='tab'>Issues</span> :
                        <Link href={`/detail/issues${query}`}>
                            <a className='tab issues'>Issues</a>
                        </Link>
                        }
                    </div>
                </div>
                <div>
                    <Comp {...rest}/>
                </div>
                <style jsx>{`
                    .root{
                        padding-top: 20px;
                    }
                    .repo-basic{
                        padding: 20px;
                        border: 1px solid #eee;
                        margin-bottom: 20px;
                        border-radius: 5px;
                    }
                    .tab + .tab{
                        margin-left: 20px;
                    }
                `}</style>
            </div>
        )
    }
    
    WithDetail.getInitialProps = async(context) => {
        const { ctx, router } = context
        const { owner, name } = ctx.query

        //cache
        const full_name = `${owner}/${name}`

        let pageData = {}
        if(Comp.getInitialProps) {
            pageData = await Comp.getInitialProps(context)
        }

        if( get(full_name) ) {
            return {
                repoBasic: get(full_name),
                ...pageData
            } 
        }

        const repoBasic = await api.request({
            url: `/repos/${owner}/${name}`
        }, ctx.req, ctx.res)

        

        return {
            repoBasic: repoBasic.data,
            ...pageData
        }
    }

    return withRouter(WithDetail)
}