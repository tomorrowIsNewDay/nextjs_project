import { memo, useMemo } from 'react'
import MarkdownIt from 'markdown-it'
import 'github-markdown-css'

const md = new MarkdownIt({
    html: true,
    linkify: true
})

function b64_to_utf8(str) {
    // 处理中文乱码问题
    return decodeURIComponent(escape(atob(str)))
}

export default memo(function MarkdownRender({content, isBase64}) {
    const markdown = isBase64 ? b64_to_utf8(readme.content) : content
    const html = useMemo( () => md.render(markdown), [markdown] ) 

    return (
        <div className='markdown-body'>
            <div dangerouslySetInnerHTML={{__html: html}} />
        </div>
    )
})