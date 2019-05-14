import { combineReducers } from 'redux'
import controls from './controls'
import debug from './debug'
import entities from './entities'
import gamepads from './gamepads'
import inventory from './inventory'
import keymap from './keymap'
import playerEntityID from './playerEntityID'
import ui from './ui'
import user from './user'





export default combineReducers({
  controls,
  debug,
  entities,
  gamepads,
  inventory,
  keymap,
  playerEntityID,
  ui,
  user,
})
