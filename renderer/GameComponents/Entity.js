// Module imports
import {
  Bodies,
  Body,
} from 'matter-js'
import uuid from 'uuid/v4'





class Entity {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  baseURL = '/static/entities'

  body = undefined

  id = uuid()

  isReady = false





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options

    this.initialize()
  }

  createBody = () => {
    const { label } = this.options
    const size = this.parseSize(this.options.size)

    const body = Body.create({
      parts: [
        Bodies.rectangle(0, 0, size.x, size.y, { label: 'sprite' }),
        Bodies.rectangle(0, (-size.y / 2), size.x, 1, {
          isSensor: true,
          label: 'top',
        }),
        Bodies.rectangle(0, (size.y / 2), size.x, 1, {
          isSensor: true,
          label: 'bottom',
        }),
        Bodies.rectangle((-size.x / 2), 0, 1, size.y, {
          isSensor: true,
          label: 'left',
        }),
        Bodies.rectangle((size.x / 2), 0, 1, size.y, {
          isSensor: true,
          label: 'right',
        }),
      ],
      frictionStatic: 0,
      frictionAir: 0.1,
      inertia: Infinity,
      label: label || 'unknown',
    })
  
    Body.setPosition(body, this.options.initialPosition)
  
    body.render = {
      ...body.render,
      contact: {
        bottom: false,
        left: false,
        right: false,
        top: false,
      },
      currentFrameIndex: 0,
      currentFrameDuration: 0,
      direction: 'east',
      id: this.id,
      image: new Image,
      imageDownloadComplete: false,
      imageDownloadStarted: false,
      pingPongDirection: 'forward',
      size,
      velocityMultipliers: {
        sneak: 0.25,
        sprint: 1,
        walk: 0.6,
      },
    }

    this.body = body

    return body
  }

  getCurrentFrame = () => {
    const { spriteData } = this.body.render
    let {
      currentFrameDuration,
      currentFrameIndex,
      pingPongDirection,
    } = this.body.render

    const currentFrame = spriteData.frames[currentFrameIndex]
    const frameTag = spriteData.meta.frameTags.find(({ name }) => name === this.getState())
    let frameIsComplete = currentFrameDuration >= currentFrame.duration

    if (frameIsComplete) {
      currentFrameDuration = 0

      if (frameTag.direction === 'forward') {
        if (currentFrameIndex >= frameTag.to) {
          currentFrameIndex = frameTag.from
        } else {
          currentFrameIndex += 1
        }
      } else if (frameTag.direction === 'reverse') {
        if (currentFrameIndex <= frameTag.from) {
          currentFrameIndex = frameTag.to
        } else {
          currentFrameIndex -= 1
        }
      } else { // frameTag.direction === ping-pong
        if (pingPongDirection === 'forward') {
          if (currentFrameIndex >= frameTag.to) {
            pingPongDirection = 'reverse'
            currentFrameIndex -= 1
          } else {
            currentFrameIndex += 1
          }
        } else {
          if (currentFrameIndex <= frameTag.from) {
            pingPongDirection = 'forward'
            currentFrameIndex += 1
          } else {
            currentFrameIndex -= 1
          }
        }
      }
    } else {
      currentFrameDuration += 16
    }


    this.body.render = {
      ...this.body.render,
      currentFrameDuration,
      currentFrameIndex,
      pingPongDirection,
    }

    return spriteData.frames[currentFrameIndex]
  }

  getDirection = () => {
    const { velocity } = this.body

    if (velocity.x !== 0) {
      this.body.render.direction = (velocity.x > 0) ? 'east' : 'west'
    }

    return this.body.render.direction
  }

  getState = () => {
    if (this.body.speed > 0.001) {
      return 'walk'
    }

    return 'idle'
  }

  initialize = async () => {
    this.createBody()

    const spriteData = await fetch(`${this.baseURL}/${this.options.type}.json`).then(response => response.json())
    const image = this.body.render.image = new Image
    const imageLoadPromise = new Promise(resolve => {
      this.body.render.imageDownloadStarted = true

      image.onload = () => {
        this.body.render.imageDownloadComplete = true
        resolve()
      }
    })

    image.src = spriteData.meta.image.substring(spriteData.meta.image.indexOf(this.baseURL))

    await imageLoadPromise

    this.body.render.spriteData = spriteData
    this.isReady = true
  }

  parseSize (originalSize) {
    let parsedSize = originalSize

    if (typeof parsedSize === 'string') {
      parsedSize = parseInt(parsedSize)
    }

    if (typeof parsedSize !== 'object') {
      if (isNaN(parsedSize)) {
        throw new Error('entity sizes MUST be a number')
      }
  
      parsedSize = {
        x: parsedSize,
        y: parsedSize,
      }
    }

    return parsedSize
  }
}





export { Entity }
