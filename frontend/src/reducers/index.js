import {combineReducers} from 'redux'
import setCurrEmail from './useReducers.js'


const rootReducer=combineReducers({
    user:setCurrEmail
});

export default rootReducer;