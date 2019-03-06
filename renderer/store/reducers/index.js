import { combineReducers } from 'redux'
import controls from './controls'
import debug from './debug'
import entities from './entities'
import inventory from './inventory'
import playerEntity from './playerEntity'
import ui from './ui'





export default combineReducers({
  controls,
  debug,
  entities,
  inventory,
  playerEntity,
  ui,
})
