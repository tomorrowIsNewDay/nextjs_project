import { cloneElement } from 'react'

const style = {
    width: '100%',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20
}

// 抽离 布局容器组件
// 类似render props， 此处多了 cloneElement
export default ({renderer=<div/>, children}) => {

    return cloneElement(renderer, {
        style: Object.assign({}, renderer.props.style, style),
        children
    })
}

// export default ({children, comp: Comp}) => {

//     // Comp是传入的标签名，注意大写
//     return <Comp style={style}> {children} </Comp>
// }