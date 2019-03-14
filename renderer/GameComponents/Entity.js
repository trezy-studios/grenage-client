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

  contact = {
    bottom: false,
    left: false,
    right: false,
    top: false,
  }

  dead = false

  environmentalHitboxes = {}

  hitPoints = 10

  id = uuid()

  isReady = false
  
  spriteBody = undefined
  
  spriteData = undefined

  hitboxes = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _generateHitboxes = (hitboxContainer, hitboxSlices, name, isSensor = false) => {
    const {
      size,
      zones,
    } = this

    if (hitboxSlices.length > 1) {
      for (const hitboxSlice of hitboxSlices) {
        const hitboxDirection = hitboxSlice.name.split('::')[1]
        const hitboxBounds = hitboxSlice.keys[0].bounds
        const zoneBounds = zones.find(({ name }) => new RegExp(`${hitboxDirection}$`, 'gi').test(name)).keys[0].bounds

        const hitboxX = (hitboxBounds.w / 2) + hitboxBounds.x
        const hitboxY = (hitboxBounds.h / 2) + hitboxBounds.y

        hitboxContainer[hitboxDirection] = Bodies.rectangle(hitboxX, hitboxY, hitboxBounds.w, hitboxBounds.h, {
          label: name,
          isSensor,
        })

        hitboxContainer[hitboxDirection].entity = this
      }
    } else {
      const hitboxBounds = hitboxSlices[0].keys[0].bounds
      const hitboxX = (hitboxBounds.w / 2) + hitboxBounds.x
      const hitboxY = (hitboxBounds.h / 2) + hitboxBounds.y

      const hitboxBody = Bodies.rectangle(hitboxX, hitboxY, hitboxBounds.w, hitboxBounds.h, {
        label: name,
        isSensor,
      })

      for (const hitboxDirection of ['east', 'north', 'south', 'west']) {
        hitboxContainer[hitboxDirection] = hitboxBody
        hitboxContainer[hitboxDirection].entity = this
      }
    }

    return hitboxContainer
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  attack = () => {
    const attackSensorPosition = {
      x: this.body.position.x,
      y: this.body.position.y,
    }
    const direction = this.getDirection()
    const size = this.size

    switch (direction) {
      case 'east':
        attackSensorPosition.x += size.w
        break

      case 'north':
        attackSensorPosition.y -= size.h
        break

      case 'south':
        attackSensorPosition.y += size.h
        break

      case 'west':
        attackSensorPosition.x -= size.w
        break
    }

    const attackSensor = Bodies.rectangle(attackSensorPosition.x, attackSensorPosition.y, size.w, size.h, {
      isSensor: true,
      label: `attack`,
    })

    attackSensor.entity = this

    return attackSensor
  }

  constructor (options) {
    this.options = options

    this.initialize()
  }

  createBody = () => {
    const { label } = this.options
    const {
      environmentalHitboxSlices,
      hitboxSlices,
      size,
    } = this
    const bodyParts = []

    this.spriteBody = Bodies.rectangle((size.w / 2), (size.h / 2), size.w, size.h, {
      isSensor: true,
      label: 'sprite',
    })
    this.spriteBody.entity = this

    bodyParts.push(this.spriteBody)

    this._generateHitboxes(this.hitboxes, hitboxSlices, 'hitbox', !!environmentalHitboxSlices.length)
    bodyParts.push(this.hitboxes['south'])

    if (environmentalHitboxSlices.length) {
      this._generateHitboxes(this.environmentalHitboxes, environmentalHitboxSlices, 'environmental-hitbox')
      bodyParts.push(this.environmentalHitboxes['south'])
    }

    const body = Body.create({
      parts: bodyParts,
      frictionStatic: 0,
      frictionAir: 0.1,
      inertia: Infinity,
      label: label || 'unknown',
    })

    Body.setPosition(body, this.options.initialPosition)

    body.entity = this
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
      direction: 'south',
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

  damage = damageAmount => {
    this.hitPoints -= damageAmount

    console.log(`Entity ${this.id} is now at ${this.hitPoints} HP!`)

    if (this.hitPoints <= 0) {
      this.kill()
    }
  }

  getAttackDamage = (type = 'iron-shortsword') => {
    switch (type) {
      case 'iron-shortsword':
        return 1
    }
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

    return spriteData.frames[currentFrameIndex].frame
  }

  getCoordinatesToRender = () => {
    const renderBounds = { ...this.getCurrentFrame() }
    const zones = this.zones

    if (zones.length) {
      const zone = zones.find(({ name }) => new RegExp(`::${this.getDirection()}$`, 'gi').test(name))
      const { bounds } = zone.keys[0]

      renderBounds.h = bounds.h
      renderBounds.w = bounds.w
      renderBounds.x = renderBounds.x + bounds.x
      renderBounds.y = renderBounds.y + bounds.y
    }

    return renderBounds
  }

  getDirection = () => {
    const { velocity } = this.body
    const directions = {
      x: ['east', 'west'],
      y: ['south', 'north'],
    }

    if (Math.abs(velocity.x + velocity.y) !== 0) {
      const axis = (Math.abs(velocity.x) > Math.abs(velocity.y)) ? 'x' : 'y'
      this.body.render.direction = (velocity[axis] > 0) ? directions[axis][0] : directions[axis][1]
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
    const spriteData = await fetch(`${this.baseURL}/${this.options.type}.json`).then(response => response.json())
    this.spriteData = spriteData

    this.createBody()

    const image = new Image
    const imageLoadPromise = new Promise(resolve => {
      this.body.render.imageDownloadStarted = true

      image.onload = () => {
        this.body.render.imageDownloadComplete = true
        resolve()
      }
    })

    image.src = spriteData.meta.image.substring(spriteData.meta.image.indexOf(this.baseURL))

    await imageLoadPromise

    this.body.render.image = image
    this.body.render.spriteData = spriteData
    this.isReady = true
  }

  kill = () => {
    this.dead = true

    console.log(`Entity ${this.id} has been killed!`)
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get environmentalHitbox () {
    const bodyParts = this.body.parts
    let environmentalHitbox = bodyParts.find(({ label }) => label === 'environmental-hitbox')

    if (!environmentalHitbox) {
      environmentalHitbox = bodyParts.find(({ label }) => label === 'hitbox')
    }

    return environmentalHitbox
  }

  get environmentalHitboxSlices () {
    return this.spriteData.meta.slices.filter(({ name }) => /^environmental-hitbox/gi.test(name))
  }

  get hitboxSlices () {
    return this.spriteData.meta.slices.filter(({ name }) => /^hitbox/gi.test(name))
  }

  get size () {
    const zones = this.zones

    if (zones.length) {
      return zones[0].keys[0].bounds
    }

    return this.spriteData.frames[0].sourceSize
  }

  get zones () {
    return this.spriteData.meta.slices.filter(({ name }) => /^zone::/gi.test(name))
  }
}





export { Entity }
