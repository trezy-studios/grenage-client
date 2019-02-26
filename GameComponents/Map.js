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





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options
  }

  initialize = async () => {
    const context = this.offscreenCanvas.getContext('2d', { alpha: false })
    const imageLoadPromises = []

    const mapData = await fetch(`${this.baseURL}/${this.options.mapName}.json`).then(response => response.json())

    for (const tilesetDatum of mapData.tilesets) {
      const imageURL = `${this.baseURL}/${tilesetDatum.image}`
      const image = document.createElement('img')

      imageLoadPromises.push(new Promise(resolve => image.onload = resolve))

      image.src = imageURL

      tilesetDatum.image = image
    }

    await Promise.all(imageLoadPromises)

    const {
      backgroundcolor,
      height,
      layers,
      tileheight,
      tilewidth,
      width,
    } = mapData

    for (const layer of layers.filter(({ type }) => type === 'tilelayer')) {
      this.size = {
        x: Math.max(this.size.x, layer.width),
        y: Math.max(this.size.y, layer.height),
      }
    }

    this.size = {
      x: this.size.x * tilewidth,
      y: this.size.y * tileheight,
    }

    this.anchorPoint = {
      x: this.size.x / 2,
      y: this.size.y / 2,
    }

    this.offscreenCanvas.setAttribute('height', this.size.y)
    this.offscreenCanvas.setAttribute('width', this.size.x)

    context.fillStyle = backgroundcolor
    context.fillRect(0, 0, this.size.x, this.size.y)

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
              const tileset = mapData.tilesets[0]
              const tile = tileset.tiles[tileID]

              if (tile) {
                const destinationX = (tilewidth * (index % chunk.width)) + chunkOffsetX
                const destinationY = (Math.floor(index / chunk.width) * tileheight) + chunkOffsetY

                const sourceX = (tileset.tilewidth * ((tileID - 1) % tileset.columns))
                const sourceY = Math.floor((tileID - 1) / tileset.columns) * tileset.tileheight

                context.drawImage(tileset.image, sourceX, sourceY, tilewidth, tileheight, destinationX, destinationY, tilewidth, tileheight)

                if (tile.objectgroup) {
                  for (const object of tile.objectgroup.objects) {
                    const objectX = object.x + this.anchorPoint.x
                    const objectY = object.y + this.anchorPoint.y

                    Composite.add(this.bodies, Bodies.rectangle(objectX, objectY, object.width, object.height, {
                      label: object.name,
                      isStatic: true,
                    }))
                  }
                }
              }
            }
          }
          break
      }
    }

    this.isReady = true
  }
}





export { Map }
