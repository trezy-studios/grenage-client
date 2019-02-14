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





// Local imports
import {
  Entity,
  Map,
} from '../GameComponents'
import { actions } from '../store'
import { isBrowser } from '../helpers'
import { MapRenderer } from '../components'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  addItem: actions.inventory.addItem,
  destroyItem: actions.inventory.destroyItem,
}, dispatch)
const mapStateToProps = ({ inventory }) => ({ inventory })





@connect(mapStateToProps, mapDispatchToProps)
class Game extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  keysPressed = {
    ' ': false,
    a: false,
    control: false,
    d: false,
    s: false,
    shift: false,
    w: false,
  }

  entities = []

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

  _generateMap () {
    this.map = new Map({
      type: 'Hometown',
    })
  }

  _generateInitialBodies () {
    const player = new Entity({
      initialPosition: this.center,
      label: 'player',
      size: 32,
      type: 'knight',
    })

    this.playerEntity = player

    this.entities.push(player)
    this.entities.push(new Entity({
      initialPosition: {
        ...this.center,
        x: this.center.x - 50,
      },
      label: 'Gelatinous Cube',
      size: 32,
      type: 'knight',
    }))
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
    this.keysPressed[event.key.toLowerCase()] = false
  }

  _handleKeydown = event => {
    this.keysPressed[event.key.toLowerCase()] = true
  }

  _render = () => {
    const {
      x: playerX,
      y: playerY,
    } = this.playerEntity.body.position
    const {
      height,
      width,
    } = this.state
    const {
      x: playerWidth,
      y: playerHeight,
    } = this.playerEntity.size
    const velocity = {
      x: 0,
      xy: 0,
    }
    let velocityMultiplier = 0.25

    if (this.keysPressed['shift']) {
      velocityMultiplier = 0.6
    }

    if (this.keysPressed['control']) {
      velocityMultiplier = 0.1
    }

    velocity.x = ((+this.keysPressed['d']) - (+this.keysPressed['a'])) * velocityMultiplier
    velocity.y = ((+this.keysPressed['s']) - (+this.keysPressed['w'])) * velocityMultiplier

    if (velocity.x !== 0) {
      this.playerEntity.direction = (velocity.x > 0) ? 'right' : 'left'
    }

    const playerIsPushingAgainstBottomOfMap = (playerY >= ((height * 2) - playerHeight)) && this.keysPressed['s']
    const playerIsPushingAgainstLeftOfMap = (playerX <= 0) && this.keysPressed['a']
    const playerIsPushingAgainstRightOfMap = (playerX >= ((width * 2) - playerWidth)) && this.keysPressed['d']
    const playerIsPushingAgainstTopOfMap = (playerY <= 0) && this.keysPressed['w']

    const playerIsMovingIntoEntityOnBottom = this.playerEntity.contact.bottom && (velocity.y > 0)
    const playerIsMovingIntoEntityOnLeft = this.playerEntity.contact.left && (velocity.x < 0)
    const playerIsMovingIntoEntityOnRight = this.playerEntity.contact.right && (velocity.x > 0)
    const playerIsMovingIntoEntityOnTop = this.playerEntity.contact.top && (velocity.y < 0)

    if (playerIsPushingAgainstLeftOfMap || playerIsPushingAgainstRightOfMap || playerIsMovingIntoEntityOnLeft || playerIsMovingIntoEntityOnRight) {
      velocity.x = 0
    }

    if (playerIsPushingAgainstBottomOfMap || playerIsPushingAgainstTopOfMap || playerIsMovingIntoEntityOnBottom || playerIsMovingIntoEntityOnTop) {
      velocity.y = 0
    }

    if (this.keysPressed[' ']) {
      console.log('Attack!')
    }

    Body.setVelocity(this.playerEntity.body, velocity)

    Engine.update(this.engine)

    this.forceUpdate()
  }

  _start = async () => {
    await this._updateSize()
    this._generateMap()
    this._generateInitialBodies()

    this.engine.world.gravity.y = 0

    World.add(this.engine.world, this.bodies)

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
          height: offsetHeight,
          width: offsetWidth,
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
    const {
      height,
      width,
    } = this.state

    let viewX = 0
    let viewY = 0

    if (this.playerEntity) {
      const {
        x: playerX,
        y: playerY,
      } = this.playerEntity.body.position

      viewX = playerX - (width / 2)
      viewY = playerY - (height / 2)

      if (viewX <= 0) {
        viewX = 0
      } else if (viewX >= width) {
        viewX = width
      }

      if (viewY <= 0) {
        viewY = 0
      } else if (viewY >= height) {
        viewY = height
      }
    }

    let offsetX = viewX
    let offsetY = viewY

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

        {/* <canvas id="game-entities" /> */}

        <svg
          height={height}
          ref={this.svgElement}
          version="1.2"
          viewBox={`${viewX} ${viewY} ${width} ${height}`}
          width={width}>

          <g id="game-entities">
            {Composite.allBodies(this.engine.world).map(body => {
              return body.parts.map(bodyPart => {
                if (bodyPart === body) {
                  return (
                    <text
                      dy="-3em"
                      key={bodyPart.id}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        fontSize: '6px',
                      }}
                      textAnchor="middle"
                      x={bodyPart.position.x}
                      y={bodyPart.position.y}>
                      {bodyPart.label}
                    </text>
                  )
                }

                const { vertices } = bodyPart
                let path = ''

                for (const vertex of bodyPart.vertices) {
                  if (!path) {
                    path += `M${vertex.x},${vertex.y}`
                  } else {
                    path += `L${vertex.x},${vertex.y}`
                  }
                }

                path += 'Z'

                return (
                  <path
                    d={path}
                    fill={bodyPart.isSensor ? 'pink' : 'purple'}
                    key={bodyPart.id} />
                )
              })

              // const maskID = `sprite-mask-${id}`

              // if (!entity.imageData) {
              //   return null
              // }

              // const {
              //   x: imageX,
              //   y: imageY,
              // } = entity.currentFrame.frame

              // return (
              //   <g
              //     key={id}
              //     transform={[
              //       `translate(${Math.floor(position.x + ((entity.direction === 'left') ? entity.size.x : 0))}, ${Math.floor(position.y)})`,
              //       `scale(${(entity.direction === 'left') ? -1 : 1}, 1)`
              //     ].join(', ')}>
              //     <mask id={maskID}>
              //       <rect
              //         fill="white"
              //         height={entity.size.y}
              //         transform={`translate(${imageX}, ${imageY})`}
              //         width={entity.size.x} />
              //     </mask>

              //     <image
              //       height={entity.imageData.meta.size.h}
              //       mask={`url(#${maskID})`}
              //       transform={`translate(${-imageX}, ${imageY})`}
              //       width={entity.imageData.meta.size.w}
              //       xlinkHref={entity.imageURL} />
              //   </g>
              // )
            })}
          </g>
        </svg>
      </main>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get bodies () {
    return this.entities.map(({ body }) => body)
  }

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
