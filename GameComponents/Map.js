// Module imports
// import {
//   Bodies,
//   Body,
// } from 'matter-js'
// import uuid from 'uuid/v4'





class Map {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  baseURL = '/static/maps'

  isReady = false

  mapData = undefined

  offscreenCanvas = document.createElement('canvas')

  options = undefined

  tilesetData = undefined





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options
  }

  initialize = async () => {
    const tilesetPromises = []
    const mapData = await fetch(`${this.baseURL}/${this.options.mapName}.json`).then(response => response.json())

    for (const { source } of mapData.tilesets) {
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

    const context = this.offscreenCanvas.getContext('2d', { alpha: false })

    const {
      backgroundcolor,
      height,
      layers,
      tileheight,
      tilewidth,
      width,
    } = mapData
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

    this.isReady = true
  }
}





export { Map }
