import { combineReducers } from 'redux'
import controls from './controls'
import debug from './debug'
import entities from './entities'
import gamepads from './gamepads'
import inventory from './inventory'
import keymap from './keymap'
import playerEntity from './playerEntity'
import ui from './ui'





export default combineReducers({
  controls,
  debug,
  entities,
  gamepads,
  inventory,
  keymap,
  playerEntity,
  ui,
})
