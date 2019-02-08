// Module imports
import {
  Body,
  Composite,
  Engine,
  World,
} from 'matter-js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import Rafael from 'rafael'
import React from 'react'





// Local imports
import { actions } from '../store'
import { Entity } from '../GameComponents'





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
    d: false,
    s: false,
    shift: false,
    w: false,
  }

  entities = []

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
  }

  _handleKeyup = event => {
    this.keysPressed[event.key.toLowerCase()] = false
  }

  _handleKeydown = event => {
    this.keysPressed[event.key.toLowerCase()] = true
  }

  _render = () => {
    const velocityMultiplier = this.keysPressed['shift'] ? 0.75 : 0.5

    const velocity = {
      x: ((+this.keysPressed['d']) - (+this.keysPressed['a'])) * velocityMultiplier,
      y: ((+this.keysPressed['s']) - (+this.keysPressed['w'])) * velocityMultiplier,
    }

    if (velocity.x !== 0) {
      this.playerEntity.direction = (velocity.x > 0) ? 'right' : 'left'
    }

    Body.setVelocity(this.playerEntity.body, velocity)

    Engine.update(this.engine)

    this.forceUpdate()
  }

  _start = async () => {
    this._generateInitialBodies()
    await this._updateSize()

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

    return (
      <main
        className="game"
        ref={this.mainElement}>
        <svg
          height={height}
          ref={this.svgElement}
          width={width}>
          <g id="game-background" />

          <g id="game-entities">
            {Composite.allBodies(this.engine.world).map(body => {
              const {
                id,
                entity,
                position,
              } = body

              const maskID = `sprite-mask-${id}`

              if (!entity.imageData) {
                return null
              }

              const {
                x: imageX,
                y: imageY,
              } = entity.currentFrame.frame

              return (
                <g
                  key={id}
                  transform={[
                    `translate(${Math.floor(position.x + ((entity.direction === 'left') ? entity.size.x : 0))}, ${Math.floor(position.y)})`,
                    `scale(${(entity.direction === 'left') ? -1 : 1}, 1)`
                  ].join(', ')}>
                  <mask id={maskID}>
                    <rect
                      fill="white"
                      height={entity.size.y}
                      transform={`translate(${imageX}, ${imageY})`}
                      width={entity.size.x} />
                  </mask>

                  <image
                    height={entity.imageData.meta.size.h}
                    mask={`url(#${maskID})`}
                    transform={`translate(${-imageX}, ${imageY})`}
                    width={entity.imageData.meta.size.w}
                    xlinkHref={entity.imageURL} />
                </g>
              )
            })}
          </g>

          <g id="game-hud" />
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
    return this._rafael || (this._rafael = new Rafael)
  }
}





export { Game }
