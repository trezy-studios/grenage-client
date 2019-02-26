// Module imports
import {
  Body,
  Engine,
  Events,
  World,
} from 'matter-js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import Rafael from 'rafael'
import React from 'react'





// Local imports
import {
  Entity,
  Map,
} from '../GameComponents'
import { actions } from '../store'
import { isBrowser } from '../helpers'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  addEntity: actions.entities.addEntity,
  addItem: actions.inventory.addItem,
  setKeyState: actions.controls.setKeyState,
}, dispatch)
const mapStateToProps = ({
  controls,
  debug,
  entities,
  playerEntity,
  inventory,
}) => ({
  controls,
  debug,
  entities,
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

    Events.on(this.engine, 'collisionStart', event => this._handleCollisionEvent(true, event))
    Events.on(this.engine, 'collisionEnd', event => this._handleCollisionEvent(false, event))
  }

  _createPlayer () {
    const { addEntity } = this.props

    addEntity({
      isPlayer: true,
      initialPosition: this.center,
      size: 32,
      type: 'knight',
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
      } = playerEntity.body.position
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

      if (controls['shift']) {
        velocityMultiplier = playerBody.render.velocityMultipliers.run
      }

      if (controls['control']) {
        velocityMultiplier = playerBody.render.velocityMultipliers.sneak
      }

      velocity.x = ((+controls['d']) - (+controls['a'])) * velocityMultiplier
      velocity.y = ((+controls['s']) - (+controls['w'])) * velocityMultiplier

      const playerIsPushingAgainstBottomOfMap = (playerY >= (mapSize.y - (playerWidth / 2))) && controls['s']
      const playerIsPushingAgainstLeftOfMap = (playerX <= 0 + (playerWidth / 2)) && controls['a']
      const playerIsPushingAgainstRightOfMap = (playerX >= (mapSize.x - (playerWidth / 2))) && controls['d']
      const playerIsPushingAgainstTopOfMap = (playerY <= 0 + (playerWidth / 2)) && controls['w']

      const playerIsMovingIntoEntityOnBottom = playerBody.render.contact.bottom && (velocity.y > 0)
      const playerIsMovingIntoEntityOnLeft = playerBody.render.contact.left && (velocity.x < 0)
      const playerIsMovingIntoEntityOnRight = playerBody.render.contact.right && (velocity.x > 0)
      const playerIsMovingIntoEntityOnTop = playerBody.render.contact.top && (velocity.y < 0)

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
    for (const pair of pairs) {
      const {
        bodyA,
        bodyB,
        isSensor,
      } = pair

      if (isSensor && (bodyA.parent !== bodyB.parent)) {
        if (['bottom', 'left', 'right', 'top'].includes(bodyA.label)) {
          bodyA.parent.entity.contact[bodyA.label] = isStarting
        }

        if (['bottom', 'left', 'right', 'top'].includes(bodyB.label)) {
          bodyB.parent.entity.contact[bodyB.label] = isStarting
        }
      }
    }
  }

  _handleKeyup = event => {
    const { setKeyState } = this.props

    setKeyState(event.key.toLowerCase(), false)
  }

  _handleKeydown = event => {
    const { setKeyState } = this.props

    setKeyState(event.key.toLowerCase(), true)
  }

  _preload = async () => {
    const promises = []

    this.map = new Map({ mapName: 'Hometown' })
    promises.push(this.map.initialize())

    await Promise.all(promises)

    this.setState({ preloadComplete: true })
  }

  _render = () => {
    const {
      controls,
      entities,
      playerEntity,
    } = this.props
    const {
      height,
      width,
    } = this.state

    const newEntities = Object.values(entities).filter(({ body }) => !this.engine.world.bodies.includes(body))

    World.add(this.engine.world, newEntities.map(({ body }) => body))

    if (playerEntity) {
      // if (controls[' ']) {
      //   console.log('Attack!')
      // }

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
    for (const entity of Object.values(entities)) {
      if (entity.body.render.imageDownloadComplete) {
        this._renderEntity(entity, offset, context)
      }
    }
  }

  _renderEntity = (entity, offset, context) => {
    const {
      wireframesShowEntityAnchorPoints,
      wireframesShowEntityBoundingBox,
    } = this.props.debug

    const {
      frame: {
        h: sourceHeight,
        w: sourceWidth,
        x: sourceX,
        y: sourceY,
      },
    } = entity.getCurrentFrame()

    const renderableBody = entity.body.parts.find(({ label }) => label === 'sprite')

    if (renderableBody) {
      const horizontalScale = (entity.getDirection() === 'east') ? 1 : -1

      const destinationX = Math.round(renderableBody.position.x - offset.x) - (sourceWidth / 2)
      const destinationY = Math.round(renderableBody.position.y - offset.y) - (sourceHeight / 2)

      context.save()
      context.scale(horizontalScale, 1)
      context.drawImage(
        entity.body.render.image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destinationX * horizontalScale - ((horizontalScale === -1) ? sourceWidth : 0),
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

      if (wireframesShowEntityBoundingBox) {
        // Sprite bounding box
        context.beginPath()
        context.strokeStyle = 'black'
        context.strokeRect(destinationX, destinationY, sourceWidth, sourceHeight)
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

    this._createPlayer()

    this.engine.world.gravity.y = 0

    Engine.run(this.engine)

    window.matterEngine = this.engine

    this.rafael.schedule('render', this._render)
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
