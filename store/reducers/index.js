import { combineReducers } from 'redux'
import controls from './controls'
import inventory from './inventory'
import ui from './ui'





export default combineReducers({
  controls,
  inventory,
  ui,
})
