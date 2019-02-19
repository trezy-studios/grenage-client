// Module imports
import { Composite } from 'matter-js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Rafael from 'rafael'
import React from 'react'





// Local imports
import { actions } from '../store'
import { isBrowser } from '../helpers'





// Local constants
const mapStateToProps = ({ entities }) => ({ entities })





@connect(mapStateToProps)
class EntitiesRenderer extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _downloadEntityImages = entities => {
    for (const entity of Object.values(entities)) {
      if (!entity.render.imageDownloadStarted) {
        const { image } = entity.render

        image.onload = () => (entity.render.imageDownloadComplete = true)

        image.src = entity.render.imageURL

        entity.render.imageDownloadStarted = true
      }
    }

    return entities
  }

  static _getContext (canvas) {
    if (canvas) {
      return canvas.getContext('2d')
    }

    return null
  }

  _render = async () => {
    const {
      entities,
      height,
      offsetY,
      offsetX,
      width,
    } = this.props
    const context = EntitiesRenderer._getContext(this.mainCanvas.current)

    this._downloadEntityImages(entities)

    context.clearRect(0, 0, width, height)

    for (const entity of Object.values(entities)) {
      if (entity.render.imageDownloadComplete) {
        const {
          frame: {
            h: sourceHeight,
            w: sourceWidth,
            x: sourceX,
            y: sourceY,
          },
        } = entity.render.getCurrentFrame()

        const renderableBody = entity.parts.find(({ label }) => label === 'sprite')

        if (renderableBody) {
          const horizontalScale = (entity.render.getDirection() === 'east') ? 1 : -1

          const destinationX = Math.round(renderableBody.position.x - sourceWidth - offsetX) * horizontalScale - ((horizontalScale === -1) ? sourceWidth : 0)
          const destinationY = Math.round(renderableBody.position.y - sourceHeight - offsetY)

          context.save()
          context.scale(horizontalScale, 1)
          context.drawImage(entity.render.image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, sourceWidth, sourceHeight)
          context.restore()
        }
      }
    }
  }

  _start = async () => {
    const { rafael } = this.props

    rafael.schedule('entities::render', this._render)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._start()
  }

  componentWillUnmount () {
    rafael.unschedule('entities::render')
  }

  constructor (props) {
    super(props)

    this.mainCanvas = React.createRef()
  }

  render () {
    const {
      height,
      offsetX,
      offsetY,
      width,
      world,
    } = this.props

    return (
      <canvas
        height={height}
        id="game-entities"
        ref={this.mainCanvas}
        width={width} />
    )

    // return (
    //   <svg
    //     // height={height}
    //     // viewBox={`${offsetX} ${offsetY} ${width} ${height}`}
    //     // width={width}>
    //     <g id="game-entities">
    //       {Composite.allBodies(world).map(body => body.parts.map(bodyPart => {
    //         if (bodyPart === body) {
    //           return (
    //             <text
    //               dy="-3em"
    //               key={bodyPart.id}
    //               style={{
    //                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //                 fontSize: '6px',
    //               }}
    //               textAnchor="middle"
    //               x={bodyPart.position.x}
    //               y={bodyPart.position.y}>
    //               {bodyPart.label}
    //             </text>
    //           )
    //         }

    //         let path = ''

    //         for (const vertex of bodyPart.vertices) {
    //           if (!path) {
    //             path += `M${vertex.x},${vertex.y}`
    //           } else {
    //             path += `L${vertex.x},${vertex.y}`
    //           }
    //         }

    //         path += 'Z'

    //         return (
    //           <path
    //             d={path}
    //             fill={bodyPart.isSensor ? 'pink' : 'purple'}
    //             key={bodyPart.id} />
    //         )
    //       }))}
    //     </g>
    //   </svg>
    // )

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
  }
}





export { EntitiesRenderer }
