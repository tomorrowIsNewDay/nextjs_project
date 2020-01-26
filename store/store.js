import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import axios from 'axios'

import { composeWithDevTools } from 'redux-devtools-extension'

const useInitialState = {}

// types 
const LOGOUT = 'LOGOUT'

function userReducers(state = useInitialState, action) {
    switch (action.type) {
        case LOGOUT:
            return {}
        default:
            return state
    }
}

const allReducers = combineReducers({
    user: userReducers
})

// action creators
export function logout(){
    return dispatch => {
        axios.post('/logout').then( resp => {
            if(resp.status == 200) {
                dispatch({
                    type: LOGOUT
                })
            }else {
                console.log('logout faild')
            }
        } ).catch(e => {
            console.log('logout faild', e)
        })
    }
}

export default function initialStore(state) {
    const store = createStore(
        allReducers,
        Object.assign({}, {user: useInitialState}, state),
        composeWithDevTools(applyMiddleware(thunk))
    )
    // console.log('store:::', store)
    return store
}
