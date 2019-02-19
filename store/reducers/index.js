import { combineReducers } from 'redux'
import controls from './controls'
import entities from './entities'
import inventory from './inventory'
import playerEntity from './playerEntity'
import ui from './ui'





export default combineReducers({
  controls,
  entities,
  inventory,
  playerEntity,
  ui,
})
