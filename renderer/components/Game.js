// Module imports
import {
  Body,
  Composite,
  Engine,
  Events,
  World,
} from 'matter-js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import Rafael from 'rafael'
import React from 'react'
import TWEEN from '@tweenjs/tween.js'





// Local imports
import {
  Entity,
  FloatingText,
  Map,
} from '../GameComponents'
import { actions } from '../store'
import { isBrowser } from '../helpers'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  addEntity: actions.entities.addEntity,
  addGamepad: actions.gamepads.addGamepad,
  addItem: actions.inventory.addItem,
  removeEntity: actions.entities.removeEntity,
  removeGamepad: actions.gamepads.removeGamepad,
  setControlState: actions.controls.setControlState,
  unsetPressControls: actions.controls.unsetPressControls,
  updateGamepads: actions.gamepads.updateGamepads,
}, dispatch)
const mapStateToProps = ({
  controls,
  debug,
  entities,
  gamepads,
  keymap,
  playerEntity,
  inventory,
}) => ({
  controls,
  debug,
  entities,
  gamepads,
  keymap,
  playerEntity,
  inventory,
})





@connect(mapStateToProps, mapDispatchToProps)
class Game extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  map = undefined

  state = {
    height: 0,
    preloadComplete: false,
    width: 0,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindEvents () {
    window.addEventListener('resize', debounce(this._updateSize, 300))

    window.addEventListener('keyup', this._handleKeyup)
    window.addEventListener('keydown', this._handleKeydown)

    window.addEventListener('gamepadconnected', this._handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', this._handleGamepadDisconnected)

    Events.on(this.engine, 'collisionStart', event => this._handleCollisionEvent(true, event))
    Events.on(this.engine, 'collisionEnd', event => this._handleCollisionEvent(false, event))
  }

  _createPlayer = () => {
    const { addEntity } = this.props
    const playerSpawnPoint = this.map.points.find(point => point.type === 'spawn::player')

    return addEntity({
      isPlayer: true,
      initialPosition: playerSpawnPoint,
      type: 'human',
    })
  }

  _getOffset = () => {
    const { playerEntity } = this.props
    const {
      height,
      width,
    } = this.state
    const offset = {
      x: 0,
      y: 0,
    }
    const mapSize = this.map.size

    if (playerEntity) {
      const {
        x: playerX,
        y: playerY,
      } = playerEntity.spriteBody.position
      const halfHeight = height / 2
      const halfWidth = width / 2

      offset.x = playerX - halfWidth
      offset.y = playerY - halfHeight

      const eastViewBoundary = mapSize.x - width
      const southViewBoundary = mapSize.y - height

      if (offset.x < 0) {
        offset.x = 0
      } else if (offset.x >= eastViewBoundary) {
        offset.x = eastViewBoundary
      }

      if (offset.y < 0) {
        offset.y = 0
      } else if (offset.y >= southViewBoundary) {
        offset.y = southViewBoundary
      }
    }

    return offset
  }

  _getPlayerVelocity = () => {
    const {
      controls,
      playerEntity,
    } = this.props
    const velocity = {
      x: 0,
      y: 0,
    }
    const mapSize = this.map.size

    if (playerEntity) {
      const {
        height,
        width,
      } = this.state
      const playerBody = playerEntity.body
      const {
        x: playerX,
        y: playerY,
      } = playerBody.position
      const {
        x: playerWidth,
        y: playerHeight,
      } = playerBody.render.size

      let velocityMultiplier = playerBody.render.velocityMultipliers.walk

      if (controls['sprint'].isActive) {
        velocityMultiplier = playerBody.render.velocityMultipliers.sprint
      }

      if (controls['sneak'].isActive) {
        velocityMultiplier = playerBody.render.velocityMultipliers.sneak
      }

      velocity.x = ((+controls['east'].isActive) - (+controls['west'].isActive)) * velocityMultiplier
      velocity.y = ((+controls['south'].isActive) - (+controls['north'].isActive)) * velocityMultiplier

      const playerIsPushingAgainstBottomOfMap = (playerY >= (mapSize.y - (playerWidth / 2))) && controls['south'].isActive
      const playerIsPushingAgainstLeftOfMap = (playerX <= 0 + (playerWidth / 2)) && controls['west'].isActive
      const playerIsPushingAgainstRightOfMap = (playerX >= (mapSize.x - (playerWidth / 2))) && controls['east'].isActive
      const playerIsPushingAgainstTopOfMap = (playerY <= 0 + (playerWidth / 2)) && controls['north'].isActive

      const playerIsMovingIntoEntityOnBottom = playerEntity.contact.bottom && (velocity.y > 0)
      const playerIsMovingIntoEntityOnLeft = playerEntity.contact.left && (velocity.x < 0)
      const playerIsMovingIntoEntityOnRight = playerEntity.contact.right && (velocity.x > 0)
      const playerIsMovingIntoEntityOnTop = playerEntity.contact.top && (velocity.y < 0)

      if (playerIsPushingAgainstLeftOfMap || playerIsPushingAgainstRightOfMap || playerIsMovingIntoEntityOnLeft || playerIsMovingIntoEntityOnRight) {
        velocity.x = 0
      }

      if (playerIsPushingAgainstBottomOfMap || playerIsPushingAgainstTopOfMap || playerIsMovingIntoEntityOnBottom || playerIsMovingIntoEntityOnTop) {
        velocity.y = 0
      }
    }

    return velocity
  }

  _handleCollisionEvent = (isStarting, { pairs }) => {
    const { removeEntity } = this.props

    for (const pair of pairs) {
      const {
        bodyA,
        bodyB,
        isSensor,
      } = pair

      if (isSensor && bodyA.parent !== bodyB.parent) {
        const {
          attack,
          hitbox,
        } = [bodyA, bodyB].reduce((accumulator, body) => {
          if (body.label === 'hitbox') {
            accumulator.hitbox = body
          } else if (body.label === 'attack') {
            accumulator.attack = body
          }
          return accumulator
        }, {})

        if (isStarting && hitbox && attack && !attack.entity.dead && (hitbox.entity !== attack.entity)) {
          const attackDamage = attack.entity.getAttackDamage()

          hitbox.entity.damage(attackDamage)

          new FloatingText({
            onUpdate: changes => {
              const context = this.canvasElement.current.getContext('2d', { alpha: false })
              const offset = this._getOffset()
              const text = (hitbox.entity.hitPoints <= 0) ? '☠️' : attackDamage

              context.font = '0.6em "Press Start 2P"'
              context.fillStyle = `rgb(${changes.red}, ${changes.green}, ${changes.blue})`
              context.globalAlpha = changes.opacity
              context.shadowColor = 'black'
              context.shadowBlur = 2
              context.textAlign = 'center'
              context.fillText(text, changes.x - offset.x, changes.y - offset.y)

              context.globalAlpha = 1
              context.shadowColor = 'transparent'
            },
            origin: {
              ...hitbox.position,
              blue: 0,
              green: 255,
              red: 243,
            },
            destination: {
              ...hitbox.position,
              blue: 0,
              green: 101,
              red: 243,
              x: `${['+', '-'][Math.round(Math.random())]}${Math.round(Math.random() * 20)}`,
              y: '-20',
            }
          })

          if (hitbox.entity.dead) {
            removeEntity(hitbox.entity.id)
          }
        }
      }
    }
  }

  _handleKeyup = event => {
    const { setControlState } = this.props

    setControlState(event.key.toLowerCase(), false)
  }

  _handleKeydown = event => {
    const { setControlState } = this.props

    setControlState(event.key.toLowerCase(), true)
  }

  _handleGamepadConnected = ({ gamepad }) => {
    const { addGamepad } = this.props

    addGamepad(gamepad)

    if (!this.rafael.tasks['gamepads::watch']) {
      this.rafael.schedule('gamepads::watch', this._checkGamepadStates)
    }
  }

  _handleGamepadDisconnected = ({ gamepad }) => {
    const {
      gamepads,
      removeGamepad,
    } = this.props

    removeGamepad(gamepad)

    if (!Object.values(gamepads).length) {
      this.rafael.unschedule('gamepads::watch')
    }
  }

  _preload = async () => {
    const promises = []

    this.map = new Map({ mapName: 'Hometown' })
    promises.push(this.map.initialize())
    await Promise.all(promises)

    const playerEntity = this._createPlayer()
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (playerEntity.isReady) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })

    this.setState({ preloadComplete: true })
  }

  _render = () => {
    const {
      controls,
      debug,
      entities,
      playerEntity,
      unsetPressControls,
    } = this.props
    const {
      height,
      width,
    } = this.state

    const newEntities = Object.values(entities).filter(({ body, isReady }) => {
      return isReady && !this.engine.world.bodies.includes(body)
    })

    World.add(this.engine.world, newEntities.map(({ body }) => body))
    World.remove(this.engine.world, this.engine.world.bodies.filter(body => {
      return (body.label === 'attack') || (body.entity.dead && (body === body.parent))
    }), true)

    if (playerEntity && playerEntity.isReady) {
      if (controls['attack'].isActive) {
        World.add(this.engine.world, playerEntity.attack())
      }

      Body.setVelocity(playerEntity.body, this._getPlayerVelocity())
    }

    Engine.update(this.engine)

    const offset = this._getOffset()
    const context = this.canvasElement.current.getContext('2d', { alpha: false })

    // Clear the screen
    context.clearRect(0, 0, width, height)

    // Render the map
    this._renderMap(this.map, offset, context)

    // Render entities
    const entitiesAsArray = Object.values(entities).filter(({ isReady }) => isReady).sort((entityA, entityB) => {
      const entityAY = entityA.environmentalHitbox.bounds.min.y
      const entityBY = entityB.environmentalHitbox.bounds.min.y

      if (entityAY > entityBY) {
        return 1
      }

      return -1
    })

    for (const entity of entitiesAsArray) {
      if (entity.isReady && entity.body.render.imageDownloadComplete) {
        this._renderEntity(entity, offset, context)
      }
    }

    if (debug.showAllBodies) {
      for (const body of Composite.allBodies(this.engine.world)) {
        const bodyHeight = body.bounds.max.y - body.bounds.min.y
        const bodyWidth = body.bounds.max.x - body.bounds.min.x

        const bodyX = (body.position.x - (bodyWidth / 2)) - offset.x
        const bodyY = (body.position.y - (bodyHeight / 2)) - offset.y

        context.fillStyle = body.isSensor ? 'pink' : 'rgba(0, 0, 0, 0.3)'
        context.fillRect(bodyX, bodyY, bodyWidth, bodyHeight)
      }
    }

    TWEEN.update()

    unsetPressControls()
  }

  _renderEntity = (entity, offset, context) => {
    const {
      wireframesShowEntityAnchorPoints,
      wireframesShowEntityEnvironmentalHitbox,
      wireframesShowEntityHitbox,
    } = this.props.debug

    const {
      h: sourceHeight,
      w: sourceWidth,
      x: sourceX,
      y: sourceY,
    } = entity.getCoordinatesToRender()

    const renderableBody = entity.body.parts.find(({ label }) => label === 'sprite')

    if (renderableBody) {
      const destinationX = Math.round((renderableBody.position.x - offset.x) - (sourceWidth / 2))
      const destinationY = Math.round((renderableBody.position.y - offset.y) - (sourceHeight / 2))

      context.save()
      context.drawImage(
        entity.body.render.image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destinationX,
        destinationY,
        sourceWidth,
        sourceHeight
      )
      context.restore()

      if (wireframesShowEntityAnchorPoints) {
        // Sprite anchor point
        context.beginPath()
        context.arc((renderableBody.position.x - offset.x), (renderableBody.position.y - offset.y), 2, 0, 2 * Math.PI)
        context.fillStyle = 'red'
        context.fill()
      }

      if (wireframesShowEntityHitbox) {
        // Entity hitbox
        const hitbox = entity.body.parts.find(({ label }) => label === 'hitbox')
        const hitboxHeight = Math.abs(hitbox.bounds.min.y - hitbox.bounds.max.y)
        const hitboxWidth = Math.abs(hitbox.bounds.min.x - hitbox.bounds.max.x)

        context.beginPath()
        context.fillStyle = 'rgba(255, 0, 0, 0.5)'
        context.fillRect((hitbox.position.x - (hitboxWidth / 2) - offset.x), (hitbox.position.y - (hitboxHeight / 2) - offset.y), hitboxWidth, hitboxHeight)
      }

      if (wireframesShowEntityEnvironmentalHitbox) {
        // Entity environmental hitbox
        let hitbox = entity.body.parts.find(({ label }) => label === 'environmental-hitbox')

        if (!hitbox) {
          hitbox = entity.body.parts.find(({ label }) => label === 'hitbox')
        }

        const hitboxHeight = Math.abs(hitbox.bounds.min.y - hitbox.bounds.max.y)
        const hitboxWidth = Math.abs(hitbox.bounds.min.x - hitbox.bounds.max.x)

        context.beginPath()
        context.fillStyle = 'rgba(0, 255, 0, 0.5)'
        context.fillRect((hitbox.position.x - (hitboxWidth / 2) - offset.x), (hitbox.position.y - (hitboxHeight / 2) - offset.y), hitboxWidth, hitboxHeight)
      }
    }
  }

  _renderMap = (map, offset, context) => {
    const { wireframesShowMapViewBoundingBox } = this.props.debug
    const {
      height,
      width,
    } = this.state

    context.drawImage(map.offscreenCanvas, Math.round(offset.x), Math.round(offset.y), width, height, 0, 0, width, height)

    if (wireframesShowMapViewBoundingBox) {
      // View bounding box
      const halfHeight = height / 2
      const halfWidth = width / 2

      context.beginPath()
      context.strokeStyle = 'black'
      context.strokeRect(Math.round(halfWidth - offset.x), Math.round(halfHeight - offset.y), (map.size.x - width), (map.size.y - height))
    }
  }

  _start = async () => {
    await this._preload()
    await this._updateSize()

    // Bunk monster thingy

    const { addEntity } = this.props
    const goblinSpawnPoint = this.map.points.find(point => point.type === 'spawn::goblin')

    addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'flaming-skull',
    })

    addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'orange-slime',
    })

    addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'green-slime',
    })

    addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'red-slime',
    })

    addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'blue-slime',
    })

    // End bunk monster thingy

    this.engine.world.gravity.y = 0

    World.add(this.engine.world, this.map.bodies)
    Engine.run(this.engine)

    window.matterEngine = this.engine

    this.rafael.schedule('render', this._render)
  }

  // _startConnection = () => {
  //   const connection = new RTCPeerConnection()

  //   // const candidateString = `a=candidate:${Math.random().toString().replace(/^0\./, '')} 1 udp 1 0.0.0.0 80 typ host`
  //   const candidateString = 'a=candidate:1862263974 1 udp 2113937151 192.168.1.73 60834 typ host'

  //   const iceCandidate = new RTCIceCandidate({ candidate: candidateString })
  //   console.log(iceCandidate)

  //   connection.addIceCandidate(iceCandidate)
  // }

  _checkGamepadStates = () => {
    const {
      gamepads: oldGamepadStates,
      keymap,
      updateGamepads,
    } = this.props
    const gamepadsPatch = []
    const newGamepadStates = navigator.getGamepads()

    for (const newGamepadState of newGamepadStates) {
      const changes = {}
      let shouldUpdateGamepad = false

      if (newGamepadState) {
        const oldGamepadState = oldGamepadStates[newGamepadState.index]

        for (const [index, axis] of Object.entries(newGamepadState.axes)) {
          if (axis !== oldGamepadState.axes[index]) {
            changes[`Axis ${index}`] = axis
            shouldUpdateGamepad = true
          }
        }

        for (const [index, button] of Object.entries(newGamepadState.buttons)) {
          if (button.pressed !== oldGamepadState.buttons[index].pressed) {
            changes[`Button ${index}`] = button
            shouldUpdateGamepad = true
          }
        }
      }

      if (shouldUpdateGamepad) {
        gamepadsPatch.push({
          changes,
          gamepad: newGamepadState,
        })
      }
    }

    if (gamepadsPatch.length) {
      updateGamepads(gamepadsPatch)
    }
  }

  _updateSize = async () => {
    return new Promise(resolve => {
      if (this.mainElement.current) {
        const {
          offsetHeight,
          offsetWidth,
        } = this.mainElement.current

        this.setState({
          height: offsetHeight / 3,
          width: offsetWidth / 3,
        }, resolve)
      }
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._bindEvents()
    this._start()
    // this._startConnection()
  }

  componentWillUnmount () {
    rafael.unschedule('render')
  }

  constructor (props) {
    super(props)

    this.mainElement = React.createRef()
    this.canvasElement = React.createRef()
  }

  render () {
    const {
      height,
      preloadComplete,
      width,
    } = this.state

    if (!preloadComplete) {
      return (
        <main
          className="game"
          ref={this.mainElement}>
          Loading...
        </main>
      )
    }

    return (
      <main
        className="game"
        ref={this.mainElement}>
        <canvas
          height={height}
          ref={this.canvasElement}
          width={width} />
      </main>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get center () {
    return {
      x: this.state.width / 2,
      y: this.state.height / 2,
    }
  }

  get engine () {
    return this._engine || (this._engine = Engine.create())
  }

  get rafael () {
    if (!isBrowser()) {
      return null
    }

    return this._rafael || (this._rafael = new Rafael)
  }
}





export { Game }
