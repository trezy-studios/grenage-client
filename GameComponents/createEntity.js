// Module imports
import {
  Bodies,
  Body,
} from 'matter-js'
import uuid from 'uuid/v4'





const createEntity = async options => {
  const baseURL = '/static/entities'
  const spriteData = await fetch(`${baseURL}/${options.type}.json`).then(response => response.json())

  let size = options.size

  if (typeof size === 'string') {
    size = parseInt(size)
  }

  if (typeof size !== 'object') {
    if (isNaN(size)) {
      throw new Error('entity sizes MUST be a number')
    }

    size = {
      x: size,
      y: size,
    }
  }

  const chamferRadius = 10
  const body = Body.create({
    parts: [
      Bodies.rectangle(0, 0, size.x, size.y, {
        chamfer: {
          radius: chamferRadius,
        },
        label: 'sprite',
      }),
      Bodies.rectangle(0, (-size.y / 2), (size.x - chamferRadius), 1, {
        isSensor: true,
        label: 'top',
      }),
      Bodies.rectangle(0, (size.y / 2), (size.x - chamferRadius), 1, {
        isSensor: true,
        label: 'bottom',
      }),
      Bodies.rectangle((-size.x / 2), 0, 1, (size.y - chamferRadius), {
        isSensor: true,
        label: 'left',
      }),
      Bodies.rectangle((size.x / 2), 0, 1, (size.y - chamferRadius), {
        isSensor: true,
        label: 'right',
      }),
    ],
    frictionStatic: 0,
    frictionAir: 0.1,
    inertia: Infinity,
    label: options.label || 'unknown',
  })

  Body.setPosition(body, options.initialPosition)

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
    id: uuid(),
    image: new Image,
    imageDownloadComplete: false,
    imageDownloadStarted: false,
    pingPongDirection: 'forward',
    getCurrentFrame: (function () {
      const { spriteData } = this.render

      const currentFrame = spriteData.frames[this.render.currentFrameIndex]
      const frameTag = spriteData.meta.frameTags.find(({ name }) => name === this.render.getState())
      let frameIsComplete = this.render.currentFrameDuration >= currentFrame.duration

      if (frameIsComplete) {
        this.render.currentFrameDuration = 0

        if (frameTag.direction === 'forward') {
          if (this.render.currentFrameIndex >= frameTag.to) {
            this.render.currentFrameIndex = frameTag.from
          } else {
            this.render.currentFrameIndex += 1
          }
        } else if (frameTag.direction === 'reverse') {
          if (this.render.currentFrameIndex <= frameTag.from) {
            this.render.currentFrameIndex = frameTag.to
          } else {
            this.render.currentFrameIndex -= 1
          }
        } else { // frameTag.direction === ping-pong
          if (this.render.pingPongDirection === 'forward') {
            if (this.render.currentFrameIndex >= frameTag.to) {
              this.render.pingPongDirection = 'reverse'
              this.render.currentFrameIndex -= 1
            } else {
              this.render.currentFrameIndex += 1
            }
          } else {
            if (this.render.currentFrameIndex <= frameTag.from) {
              this.render.pingPongDirection = 'forward'
              this.render.currentFrameIndex += 1
            } else {
              this.render.currentFrameIndex -= 1
            }
          }
        }
      } else {
        this.render.currentFrameDuration += 16
      }
    
      return spriteData.frames[this.render.currentFrameIndex]
    }).bind(body),
    getDirection: (function () {
      if (this.velocity.x !== 0) {
        this.render.direction = (this.velocity.x > 0) ? 'east' : 'west'
      }

      return this.render.direction
    }).bind(body),
    getState: (function () {
      if (this.speed > 0.001) {
        return 'walk'
      }

      return 'idle'
    }).bind(body),
    imageURL: spriteData.meta.image.substring(spriteData.meta.image.indexOf(baseURL)),
    size,
    spriteData,
    velocityMultipliers: {
      run: 1,
      sneak: 0.25,
      walk: 0.6,
    },
  }

  return body
}





export { createEntity }
