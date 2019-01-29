import { combineReducers } from 'redux'
import inventory from './inventory'
import ui from './ui'





export default combineReducers({
  inventory,
  ui,
})
