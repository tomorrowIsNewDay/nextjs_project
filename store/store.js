import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { composeWithDevTools } from 'redux-devtools-extension'

const useInitialState = {}

function userReducers(state = useInitialState, action) {
    switch (action.type) {
        default:
            return false
    }
}

const allReducers = combineReducers({
    user: userReducers
})

export default function initialStore(state) {
    console.log('createStore:::', typeof createStore)
    const store = createStore(
        allReducers,
        Object.assign({}, {user: useInitialState}, state),
        composeWithDevTools(applyMiddleware(thunk))
    )
    console.log('store:::', store)
    return store
}
