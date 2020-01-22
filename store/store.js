import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-chunk'
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

// const reduxDevtools = window.devToolsExtension ? window.devToolsExtension() : f=>f

export default function initialStore(state) {
    const store = createStore(
        allReducers,
        Object.assign({}, {user: useInitialState}, state),
        composeWithDevTools(applyMiddleware(ReduxThunk))
    )
    return store
}



