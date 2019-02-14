// Module imports
import React from 'react'





class MapRenderer extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  baseURL = '/static/maps'

  tilesetData = undefined





  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  _generateFullMap () {
    const {
      backgroundcolor,
      height,
      layers,
      tileheight,
      tilewidth,
      width,
    } = this.mapData
    const context = MapRenderer._getContext(this.offscreenCanvas)

    const fullMapSize = layers.reduce((accumulator, layer) => {
      if (layer.type === 'tilelayer') {
        accumulator.x = Math.max(accumulator.x, layer.width)
        accumulator.y = Math.max(accumulator.y, layer.height)
      }

      return accumulator
    }, {
      x: 0,
      y: 0,
    })
    const anchorPoint = {
      x: (fullMapSize.x / 2) * tilewidth,
      y: (fullMapSize.y / 2) * tileheight,
    }

    this.offscreenCanvas.setAttribute('height', fullMapSize.y * tileheight)
    this.offscreenCanvas.setAttribute('width', fullMapSize.x * tilewidth)

    context.fillStyle = backgroundcolor
    context.fillRect(0, 0, fullMapSize.x * tilewidth, fullMapSize.y * tileheight)

    for (const layer of layers) {
      if (layer.type === 'tilelayer') {
        const {
          startx,
          starty,
        } = layer

        for (const chunk of layer.chunks) {
          const chunkOffsetX = anchorPoint.x - (~(chunk.x * tilewidth) + 1)
          const chunkOffsetY = anchorPoint.x - (~(chunk.y * tileheight) + 1)

          for (const [index, tileID] of Object.entries(chunk.data)) {
            const tileset = this.tilesetData[0]
            const tile = tileset.tiles[tileID]
            const destinationX = (tilewidth * (index % chunk.width)) + chunkOffsetX
            const destinationY = (Math.floor(index / chunk.width) * tileheight) + chunkOffsetY

            const sourceX = (tileset.tilewidth * ((tileID - 1) % tileset.columns))
            const sourceY = Math.floor((tileID - 1) / tileset.columns) * tileset.tileheight

            context.drawImage(tileset.image, sourceX, sourceY, tilewidth, tileheight, destinationX, destinationY, tilewidth, tileheight)
          }
        }
      }
    }
  }

  static _getContext (canvas) {
    return canvas.getContext('2d', { alpha: false })
  }

  _render = () => {
    const {
      height,
      offsetX,
      offsetY,
      width,
    } = this.props
    const context = MapRenderer._getContext(this.mainCanvas.current)

    context.drawImage(this.offscreenCanvas, Math.round(offsetX), Math.round(offsetY), width, height, 0, 0, width, height)
  }

  async _start () {
    const {
      mapName,
      rafael,
    } = this.props

    this.offscreenCanvas = document.createElement('canvas')

    const tilesetPromises = []
    this.mapData = await fetch(`${this.baseURL}/${mapName}.json`).then(response => response.json())

    for (const { source } of this.mapData.tilesets) {
      const promise = fetch(`${this.baseURL}/${source.replace(/\.tsx$/g, '.json')}`).then(response => response.json())
      tilesetPromises.push(promise)
    }

    this.tilesetData = await Promise.all(tilesetPromises)

    const imageLoadPromises = []

    for (const tilesetDatum of this.tilesetData) {
      const imageURL = `${this.baseURL}/${tilesetDatum.image}`
      const image = document.createElement('img')

      imageLoadPromises.push(new Promise(resolve => image.onload = resolve))

      image.src = imageURL

      tilesetDatum.image = image
    }

    await Promise.all(imageLoadPromises)

    this._generateFullMap()

    rafael.schedule('map::render', this._render)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._start()
  }

  constructor (props) {
    super(props)

    this.mainCanvas = React.createRef()
  }

  render () {
    const {
      height,
      width,
    } = this.props

    return (
      <canvas
        height={height}
        id="game-map"
        ref={this.mainCanvas}
        width={width} />
    )
  }
}





export { MapRenderer }
