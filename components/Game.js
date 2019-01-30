// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import React from 'react'





// Local imports
import { actions } from '../store'





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

  renderState = {
    drawBackground: true,
    drawEntities: true,
    drawHUD: true,
    imageCache: {},
  }

  state = {
    height: 0,
    width: 0,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindEvents () {
    window.addEventListener('resize', this._updateSize)
  }

  _handleResize () {
    this.backgroundCanvas
  }

  _loop = () => {
    if (this._loop) {
      const {
        drawBackground,
        drawEntities,
        drawHUD,
        imageCache,
      } = this.renderState

      if (drawBackground && this.backgroundContext) {
        const imageData = imageCache['grassTile']

        if (imageData.loaded) {
          const pattern = this.backgroundContext.createPattern(imageData.image, 'repeat')
          this.backgroundContext.fillStyle = pattern
          this.backgroundContext.fillRect(0, 0, this.state.width, this.state.height)
          this.renderState.drawBackground = false
        }
      }

      requestAnimationFrame(this._loop)
    }
  }

  _loadImageCache () {
    const images = {
      grassTile: '/static/tiles/grass.png',
    }

    for (const [key, imageURL] of Object.entries(images)) {
      const imageElement = new Image

      this.renderState.imageCache[key] = {
        image: imageElement,
        loaded: false,
        url: imageURL,
      }

      imageElement.onload = () => {
        this.renderState.imageCache[key].loaded = true
        this.forceUpdate()
      }

      imageElement.src = imageURL
    }
  }

  _updateSize = debounce(() => {
    const {
      offsetHeight,
      offsetWidth,
    } = this.mainElement.current

    this.renderState = {
      ...this.renderState,
      drawBackground: true,
      drawEntities: true,
      drawHUD: true,
    }

    this.setState({
      height: offsetHeight,
      width: offsetWidth,
    })
  }, 300)





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._updateSize()
    this._bindEvents()
    this._loadImageCache()
    this._loop()
  }

  constructor (props) {
    super(props)

    this.backgroundCanvas = React.createRef()
    this.entitiesCanvas = React.createRef()
    this.hudCanvas = React.createRef()
    this.mainElement = React.createRef()
  }

  render () {
    const {
      height,
      width,
    } = this.state

    const {
      loaded,
      total,
    } = Object.values(this.renderState.imageCache).reduce((accumulator, { loaded }) => {
      if (loaded) {
        accumulator.loaded += 1
      }

      accumulator.total += 1

      return accumulator
    }, {
      loaded: 0,
      total: 0,
    })

    return (
      <main
        className="game"
        ref={this.mainElement}>
        {(loaded !== total) && (
          <progress
            value={loaded}
            max={total} />
        )}

        {(loaded === total) && (
          <React.Fragment>
            <canvas
              className="background"
              height={height}
              ref={this.backgroundCanvas}
              width={width} />
            <canvas
              className="entities"
              height={height}
              ref={this.entitiesCanvas}
              width={width} />
            <canvas
              className="hud"
              height={height}
              ref={this.hudCanvas}
              width={width} />
          </React.Fragment>
        )}
      </main>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get backgroundContext () {
    // console.log('this.backgroundCanvas', this.backgroundCanvas)
    return this.backgroundCanvas.current ? this.backgroundCanvas.current.getContext('2d', { alpha: false }) : null
  }

  get entitiesContext () {
    return this.entitiesCanvas.current ? this.entitiesCanvas.current.getContext('2d') : null
  }

  get hudContext () {
    return this.hudCanvas.current ? this.hudCanvas.current.getContext('2d') : null
  }
}





export { Game }
