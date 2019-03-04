// Module imports
import {
  Bodies,
  Composite,
} from 'matter-js'
// import uuid from 'uuid/v4'





class Map {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  anchorPoint = {
    x: 0,
    y: 0,
  }

  baseURL = '/static/maps'

  bodies = undefined

  isReady = false

  mapData = undefined

  offscreenCanvas = document.createElement('canvas')

  options = undefined

  points = []

  size = {
    x: 0,
    y: 0,
  }

  tiles = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _mapTiles = async () => {
    const promises = []

    for (const tilesetDatum of this.mapData.tilesets) {
      const imageURL = `${this.baseURL}/${tilesetDatum.image}`
      const image = document.createElement('img')

      promises.push(new Promise(resolve => image.onload = resolve))

      image.src = imageURL

      tilesetDatum.image = image
    }

    await Promise.all(promises)

    for (const tilesetDatum of this.mapData.tilesets) {
      const { firstgid } = tilesetDatum
      const lengthAfterProcessingLastTileset = Object.values(this.tiles).length
      let loopIndex = 1

      while (loopIndex <= tilesetDatum.tilecount) {
        const tileIndex = (loopIndex - 1) + firstgid
        const tile = tilesetDatum.tiles.find(({ id }) => id === (loopIndex - 1))

        this.tiles[tileIndex] = {
          ...(tile || {}),
          height: tilesetDatum.tileheight,
          image: tilesetDatum.image,
          width: tilesetDatum.tilewidth,
          x: (tilesetDatum.tilewidth * (loopIndex % tilesetDatum.columns)),
          y: Math.floor(loopIndex / tilesetDatum.columns) * tilesetDatum.tileheight,
        }

        loopIndex = loopIndex + 1
      }
    }
  }

  _renderTile = (context, tileID, destination) => {
    const tile = this.tiles[tileID]

    if (tile) {
      context.drawImage(tile.image, tile.x, tile.y, tile.width, tile.height, destination.x, destination.y, tile.width, tile.height)

      if (tile.objectgroup) {
        for (const object of tile.objectgroup.objects) {
          const objectX = destination.x + object.x + (object.width / 2)
          const objectY = destination.y + object.y + (object.height / 2)

          Composite.add(this.bodies, Bodies.rectangle(objectX, objectY, object.width, object.height, {
            label: object.name,
            isStatic: true,
          }))
        }
      }
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options
  }

  initialize = async () => {
    const context = this.offscreenCanvas.getContext('2d', { alpha: false })

    this.mapData = await fetch(`${this.baseURL}/${this.options.mapName}.json`).then(response => response.json())

    await this._mapTiles()

    const {
      backgroundcolor,
      height,
      layers,
      tileheight,
      tilewidth,
      width,
    } = this.mapData

    for (const layer of layers.filter(({ type }) => type === 'tilelayer')) {
      this.size = {
        x: Math.max(this.size.x, layer.width),
        y: Math.max(this.size.y, layer.height),
      }

      this.anchorPoint = {
        x: Math.min(this.anchorPoint.x, layer.startx),
        y: Math.min(this.anchorPoint.y, layer.starty),
      }
    }

    this.size = {
      x: this.size.x * tilewidth,
      y: this.size.y * tileheight,
    }

    this.anchorPoint = {
      x: ~(this.anchorPoint.x * tilewidth) + 1,
      y: ~(this.anchorPoint.y * tileheight) + 1,
    }

    this.offscreenCanvas.setAttribute('height', this.size.y)
    this.offscreenCanvas.setAttribute('width', this.size.x)

    if (backgroundcolor) {
      context.fillStyle = backgroundcolor
      context.fillRect(0, 0, this.size.x, this.size.y)
    }

    this.bodies = Composite.create({ label: `map::${this.options.mapName}` })

    for (const layer of layers) {
      switch (layer.type) {
        case 'objectgroup':
          for (const object of layer.objects) {
            object.x = object.x + this.anchorPoint.x
            object.y = object.y + this.anchorPoint.y

            if (object.point) {
              this.points.push(object)
            } else {
              Composite.add(this.bodies, Bodies.rectangle(object.x, object.y, object.width, object.height, {
                label: object.name,
                isStatic: true,
              }))
            }
          }
          break

        case 'tilelayer':
          const {
            startx,
            starty,
          } = layer

          for (const chunk of layer.chunks) {
            const chunkOffsetX = this.anchorPoint.x - (~(chunk.x * tilewidth) + 1)
            const chunkOffsetY = this.anchorPoint.y - (~(chunk.y * tileheight) + 1)

            for (const [index, tileID] of Object.entries(chunk.data)) {
              const tileset = this.mapData.tilesets[0]

              this._renderTile(context, tileID - 1, {
                x: (tilewidth * (index % chunk.width)) + chunkOffsetX,
                y: (Math.floor(index / chunk.width) * tileheight) + chunkOffsetY,
              })
            }
          }
          break
      }
    }

    this.isReady = true
  }
}





export { Map }
