import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
const Option = Select.Option

import api from '../lib/api'
import debounce from 'lodash/debounce'

export default function SearchUser({onChange, value}) {
    const lastFetchIdRef = useRef(0)

    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])

    const handleChange = (value) => {
        setOptions([])
        setFetching(false)
        onChange(value)
    }

    // 防抖
    const fetchUser = useCallback(debounce(value => {
        lastFetchIdRef.current += 1
        const fetchId = lastFetchIdRef.current

        setFetching(true)
        setOptions([])

        //浏览器环境下，不用传req,res
        api.request({
            url: `/search/users?q=${value}`
        }).then(resp => {
            // 为了规避 闭包
            // 当当前响应与 请求不符合，直接不做响应
            // 避免短时间内，多次请求，多次响应返回
            if(fetchId !== lastFetchIdRef.current) return

            const data = resp.data.items.map(user => ({
                text: user.login,
                value: user.login
            }))
            setFetching(false)
            setOptions(data)
        })
    }, 500), [])

    return (
        <Select
            style={{ width: 200 }}
            showSearch={true}
            notFoundContent={fetching ? <Spin size='small' /> : <span>nothings</span>}
            filterOption={false}
            placeholder='创建者'
            onSearch={fetchUser}
            onChange={handleChange}
            value={value}
            allowClear={true}
        >
            { options.map(op => (
                <Option value={op.value} key={op.value}>
                    { op.text }
                </Option>
            )) }
        </Select>
    )
}