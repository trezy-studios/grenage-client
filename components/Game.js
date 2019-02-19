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
import { Entity } from '../GameComponents'
import { actions } from '../store'
import { isBrowser } from '../helpers'
import {
  EntitiesRenderer,
  MapRenderer,
} from '../components'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  addEntity: actions.entities.addEntity,
  addItem: actions.inventory.addItem,
  destroyItem: actions.inventory.destroyItem,
  setKeyState: actions.controls.setKeyState,
}, dispatch)
const mapStateToProps = ({
  controls,
  entities,
  playerEntity,
  inventory,
}) => ({
  controls,
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

  playerEntity = undefined

  state = {
    height: 0,
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

  _render = () => {
    const {
      controls,
      entities,
      playerEntity,
    } = this.props

    World.add(this.engine.world, Object.values(entities).filter(entity => !this.engine.world.bodies.includes(entity)))

    if (playerEntity) {
      const {
        height,
        width,
      } = this.state
      const {
        x: playerX,
        y: playerY,
      } = playerEntity.position
      const {
        x: playerWidth,
        y: playerHeight,
      } = playerEntity.render.size
      const velocity = {
        x: 0,
        y: 0,
      }

      let velocityMultiplier = playerEntity.render.velocityMultipliers.walk

      if (controls['shift']) {
        velocityMultiplier = playerEntity.render.velocityMultipliers.run
      }

      if (controls['control']) {
        velocityMultiplier = playerEntity.render.velocityMultipliers.sneak
      }

      velocity.x = ((+controls['d']) - (+controls['a'])) * velocityMultiplier
      velocity.y = ((+controls['s']) - (+controls['w'])) * velocityMultiplier

      const playerIsPushingAgainstBottomOfMap = (playerY >= ((height * 2) - playerHeight)) && controls['s']
      const playerIsPushingAgainstLeftOfMap = (playerX <= 0) && controls['a']
      const playerIsPushingAgainstRightOfMap = (playerX >= ((width * 2) - playerWidth)) && controls['d']
      const playerIsPushingAgainstTopOfMap = (playerY <= 0) && controls['w']

      const playerIsMovingIntoEntityOnBottom = playerEntity.render.contact.bottom && (velocity.y > 0)
      const playerIsMovingIntoEntityOnLeft = playerEntity.render.contact.left && (velocity.x < 0)
      const playerIsMovingIntoEntityOnRight = playerEntity.render.contact.right && (velocity.x > 0)
      const playerIsMovingIntoEntityOnTop = playerEntity.render.contact.top && (velocity.y < 0)

      if (playerIsPushingAgainstLeftOfMap || playerIsPushingAgainstRightOfMap || playerIsMovingIntoEntityOnLeft || playerIsMovingIntoEntityOnRight) {
        velocity.x = 0
      }

      if (playerIsPushingAgainstBottomOfMap || playerIsPushingAgainstTopOfMap || playerIsMovingIntoEntityOnBottom || playerIsMovingIntoEntityOnTop) {
        velocity.y = 0
      }

      // if (controls[' ']) {
      //   console.log('Attack!')
      // }

      Body.setVelocity(playerEntity, velocity)

      Engine.update(this.engine)
    }
  }

  _start = async () => {
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

  constructor (props) {
    super(props)

    this.mainElement = React.createRef()
    this.svgElement = React.createRef()
  }

  render () {
    const { playerEntity } = this.props
    const {
      height,
      width,
    } = this.state

    let offsetX = 0
    let offsetY = 0

    if (playerEntity) {
      const {
        x: playerX,
        y: playerY,
      } = playerEntity.position

      offsetX = playerX - (width / 2)
      offsetY = playerY - (height / 2)

      if (offsetX <= 0) {
        offsetX = 0
      } else if (offsetX >= width) {
        offsetX = width
      }

      if (offsetY <= 0) {
        offsetY = 0
      } else if (offsetY >= height) {
        offsetY = height
      }
    }

    return (
      <main
        className="game"
        ref={this.mainElement}>

        <MapRenderer
          height={height}
          mapName="Hometown"
          offsetX={offsetX}
          offsetY={offsetY}
          rafael={this.rafael}
          width={width} />

        <EntitiesRenderer
          height={height}
          offsetX={offsetX}
          offsetY={offsetY}
          rafael={this.rafael}
          width={width}
          world={this.engine.world} />
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
