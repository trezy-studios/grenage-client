// Module imports
import {
  Body,
  Composite,
  Engine,
  Events,
  World,
} from 'matter-js'
import Rafael from 'rafael'





// Local imports
import {
  actions,
  initStore,
} from '../store'





class ControlManager {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  store = initStore()





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindEvents = () => {
    window.addEventListener('keyup', this._handleKeyup)
    window.addEventListener('keydown', this._handleKeydown)

    window.addEventListener('gamepadconnected', this._handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', this._handleGamepadDisconnected)

    // Events.on(this.engine, 'collisionStart', event => this._handleCollisionEvent(true, event))
    // Events.on(this.engine, 'collisionEnd', event => this._handleCollisionEvent(false, event))
  }

  _handleCollisionEvent = () => {}

  _handleGamepadConnected = () => {}

  _handleGamepadDisconnected = () => {}

  _handleKeyup = event => {
    const { dispatch } = this.store
    const { setControlState } = actions.controls

    dispatch(setControlState(event.key.toLowerCase(), false))
  }

  _handleKeydown = event => {
    const { dispatch } = this.store
    const { setControlState } = actions.controls

    dispatch(setControlState(event.key.toLowerCase(), true))
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options
    this.initialize()
  }

  initialize = async () => {
    this._bindEvents()
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get defaultOptions () {
    return {}
  }

  get options () {
    return this._options
  }

  get state () {
    return this.store.getState()
  }





  /***************************************************************************\
    Setters
  \***************************************************************************/

  set options (value) {
    this._options = {
      ...this.defaultOptions,
      ...value,
    }
  }
}





export { ControlManager }
