// Module imports
import {
  Body,
  Composite,
  Engine,
  Events,
  World,
} from 'matter-js'
import { debounce } from 'lodash'
import Rafael from 'rafael'
import TWEEN from '@tweenjs/tween.js'





// Local imports
import {
  Entity,
  Map,
} from '.'
import {
  actions,
  initStore,
} from '../store'





class GameRenderer {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  entities = {}

  store = initStore()





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindEvents = () => {
    window.addEventListener('resize', debounce(this._updateWindowSize, 300))

    window.addEventListener('keyup', this._handleKeyup)
    window.addEventListener('keydown', this._handleKeydown)

    window.addEventListener('gamepadconnected', this._handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', this._handleGamepadDisconnected)

    // Events.on(this.engine, 'collisionStart', event => this._handleCollisionEvent(true, event))
    // Events.on(this.engine, 'collisionEnd', event => this._handleCollisionEvent(false, event))
  }

  _createPlayer = () => {
    const { dispatch } = this.store
    const { addEntity } = actions.entities

    const playerSpawnPoint = this.map.points.find(point => point.type === 'spawn::player')

    dispatch(addEntity({
      isPlayer: true,
      initialPosition: playerSpawnPoint,
      type: 'human',
    }))
  }

  _getOffset = () => {
    const {
      entities,
      playerEntityID,
      ui,
    } = this.state
    const playerEntity = this.entities[playerEntityID]
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
      const halfHeight = ui.height / 2
      const halfWidth = ui.width / 2

      offset.x = playerX - halfWidth
      offset.y = playerY - halfHeight

      const eastViewBoundary = mapSize.x - ui.width
      const southViewBoundary = mapSize.y - ui.height

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
      playerEntityID,
    } = this.state
    const playerEntity = this.entities[playerEntityID]
    const velocity = {
      x: 0,
      y: 0,
    }
    const mapSize = this.map.size

    if (playerEntity) {
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

  _handleCollisionEvent = () => {}

  _handleGamepadConnected = () => {}

  _handleGamepadDisconnected = () => {}

  _handleKeyup = () => {}

  _handleKeydown = () => {}

  _preload = async () => {
    const promises = []

    this.map = new Map({ mapName: 'Hometown' })
    promises.push(this.map.initialize())
    await Promise.all(promises)

    this._createPlayer()
    // await new Promise(resolve => {
    //   const interval = setInterval(() => {
    //     if (playerEntity.isReady) {
    //       clearInterval(interval)
    //       resolve()
    //     }
    //   }, 100)
    // })

    // this.setState({ preloadComplete: true })
  }

  _render = () => {
    const {
      controls,
      debug,
      entities,
      playerEntityID,
      ui,
    } = this.state
    const { dispatch } = this.store
    const { unsetPressControls } = actions.controls
    const playerEntity = this.entities[playerEntityID]

    if (this.mainCanvas.getAttribute('height') !== ui.height) {
      this.mainCanvas.setAttribute('height', ui.height)
    }

    if (this.mainCanvas.getAttribute('width') !== ui.width) {
      this.mainCanvas.setAttribute('width', ui.width)
    }

    const newEntities = Object.values(this.entities).filter(({ body, isReady }) => {
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
    const context = this.mainCanvas.getContext('2d', { alpha: false })

    // Clear the screen
    context.clearRect(0, 0, ui.width, ui.height)

    // Render the map
    this._renderMap({
      context,
      height: ui.height,
      map: this.map,
      offset,
      width: ui.width,
    })

    // Render entities
    for (const [id, entity] of Object.entries(entities)) {
      if (!this.entities[id]) {
        this.entities[id] = new Entity(entity)
      }
    }

    const entitiesAsArray = Object.values(this.entities).filter(({ isReady }) => isReady).sort((entityA, entityB) => {
      const entityADirection = entityA.getDirection()
      const entityAHitbox = entityA.environmentalHitboxes[entityADirection] || entityA.hitboxes[entityADirection]
      const entityAY = entityAHitbox.bounds.min.y

      const entityBDirection = entityB.getDirection()
      const entityBHitbox = entityB.environmentalHitboxes[entityBDirection] || entityB.hitboxes[entityBDirection]
      const entityBY = entityBHitbox.bounds.min.y

      if (entityAY > entityBY) {
        return 1
      }

      return -1
    })

    for (const entity of entitiesAsArray) {
      if (entity.isReady) {
        this._renderEntity(entity, offset, context)
      }
    }

    // if (debug.showAllBodies) {
    //   for (const body of Composite.allBodies(this.engine.world)) {
    //     const bodyHeight = body.bounds.max.y - body.bounds.min.y
    //     const bodyWidth = body.bounds.max.x - body.bounds.min.x

    //     const bodyX = (body.position.x - (bodyWidth / 2)) - offset.x
    //     const bodyY = (body.position.y - (bodyHeight / 2)) - offset.y

    //     context.fillStyle = body.isSensor ? 'pink' : 'rgba(0, 0, 0, 0.3)'
    //     context.fillRect(bodyX, bodyY, bodyWidth, bodyHeight)
    //   }
    // }

    TWEEN.update()

    unsetPressControls()
  }

  _renderEntity = (entity, offset, context) => {
    // const {
    //   wireframesShowEntityAnchorPoints,
    //   wireframesShowEntityEnvironmentalHitbox,
    //   wireframesShowEntityHitbox,
    // } = this.props.debug

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
        entity.image,
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

      // if (wireframesShowEntityAnchorPoints) {
      //   // Sprite anchor point
      //   context.beginPath()
      //   context.arc((renderableBody.position.x - offset.x), (renderableBody.position.y - offset.y), 2, 0, 2 * Math.PI)
      //   context.fillStyle = 'red'
      //   context.fill()
      // }

      // if (wireframesShowEntityHitbox) {
      //   // Entity hitbox
      //   const hitbox = entity.body.parts.find(({ label }) => label === 'hitbox')
      //   const hitboxHeight = Math.abs(hitbox.bounds.min.y - hitbox.bounds.max.y)
      //   const hitboxWidth = Math.abs(hitbox.bounds.min.x - hitbox.bounds.max.x)

      //   context.beginPath()
      //   context.fillStyle = 'rgba(255, 0, 0, 0.5)'
      //   context.fillRect((hitbox.position.x - (hitboxWidth / 2) - offset.x), (hitbox.position.y - (hitboxHeight / 2) - offset.y), hitboxWidth, hitboxHeight)
      // }

      // if (wireframesShowEntityEnvironmentalHitbox) {
      //   // Entity environmental hitbox
      //   let hitbox = entity.body.parts.find(({ label }) => label === 'environmental-hitbox')

      //   if (!hitbox) {
      //     hitbox = entity.body.parts.find(({ label }) => label === 'hitbox')
      //   }

      //   const hitboxHeight = Math.abs(hitbox.bounds.min.y - hitbox.bounds.max.y)
      //   const hitboxWidth = Math.abs(hitbox.bounds.min.x - hitbox.bounds.max.x)

      //   context.beginPath()
      //   context.fillStyle = 'rgba(0, 255, 0, 0.5)'
      //   context.fillRect((hitbox.position.x - (hitboxWidth / 2) - offset.x), (hitbox.position.y - (hitboxHeight / 2) - offset.y), hitboxWidth, hitboxHeight)
      // }
    }
  }

  _renderMap = options => {
    const {
      context,
      height,
      map,
      offset,
      width,
    } = options
    // const { wireframesShowMapViewBoundingBox } = this.props.debug

    context.drawImage(map.offscreenCanvas, Math.round(offset.x), Math.round(offset.y), width, height, 0, 0, width, height)

    // if (wireframesShowMapViewBoundingBox) {
    //   // View bounding box
    //   const halfHeight = height / 2
    //   const halfWidth = width / 2

    //   context.beginPath()
    //   context.strokeStyle = 'black'
    //   context.strokeRect(Math.round(halfWidth - offset.x), Math.round(halfHeight - offset.y), (map.size.x - width), (map.size.y - height))
    // }
  }

  _updateWindowSize = () => {
    const { dispatch } = this.store
    const { updateWindowSize } = actions.ui

    dispatch(updateWindowSize(window.innerWidth, window.innerHeight))
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    window.GameRenderer = this
    this.options = options
    this.initialize()
  }

  initialize = async () => {
    this.element.appendChild(this.mainCanvas)

    this._updateWindowSize()
    this._bindEvents()

    await this._preload()

    // Bunk monster thingy

    const { dispatch } = this.store
    const { addEntity } = actions.entities
    const goblinSpawnPoint = this.map.points.find(point => point.type === 'spawn::goblin')

    dispatch(addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'flaming-skull',
    }))

    dispatch(addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'orange-slime',
    }))

    dispatch(addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'green-slime',
    }))

    dispatch(addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'red-slime',
    }))

    dispatch(addEntity({
      initialPosition: goblinSpawnPoint,
      type: 'blue-slime',
    }))

    // End bunk monster thingy

    this.engine.world.gravity.y = 0

    World.add(this.engine.world, this.map.bodies)
    Engine.run(this.engine)

    this.rafael.schedule('render', this._render)
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get mainCanvas () {
    if (!this._canvas) {
      if (this.element.children.length) {
        this._canvas = this.element.children[0]
      } else {
        this._canvas = document.createElement('canvas')
      }
    }

    return this._canvas
  }

  get defaultOptions () {
    return {}
  }

  get element () {
    return this.options.element
  }

  get engine () {
    return this._engine || (this._engine = Engine.create())
  }

  get options () {
    return this._options
  }

  get rafael () {
    return this._rafael || (this._rafael = new Rafael)
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





export { GameRenderer }
