// Module imports
import { Bodies } from 'matter-js'





class Entity {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  baseURL = '/static/entities'

  imageData = undefined

  options = undefined





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _getImageData () {
    const response = await fetch(`${this.baseURL}/${this.type}.json`)
    this.imageData = await response.json()
  }

  static _validate (options) {
    const missingKeys = []
    const requiredKeys = [
      'label',
      'size',
      'type',
    ]

    for (const requiredKey of requiredKeys) {
      if (!options[requiredKey]) {
        missingKeys.push(requiredKey)
      }
    }

    if (missingKeys.length) {
      console.error(`Entity is missing required keys: ${missingKeys.join(', ')}`)
      return false
    }

    return true
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    if (Entity._validate(options)) {
      this.options = options
      this._getImageData()
    }
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get body () {
    if (!this._body) {
      const body = Bodies.rectangle(this.initialPosition.x, this.initialPosition.y, this.size.x, this.size.y)

      body.entity = this

      if (this.label) {
        body.label = this.label
      }

      this._body = body
    }

    return this._body
  }

  get currentFrame () {
    this._currentFrameIndex || (this._currentFrameIndex = 0)
    this._currentFrameDuration || (this._currentFrameDuration = 0)

    const currentFrame = this.imageData.frames[this._currentFrameIndex]
    const frameTag = this.frameTags.find(({ name }) => name === this.state)
    let frameIsComplete = this._currentFrameDuration >= currentFrame.duration

    if (frameTag.direction === 'pingpong') {
      this._pingPongDirection || (this._pingPongDirection = 'forward')
    }

    if (frameIsComplete) {
      this._currentFrameDuration = 0

      if (frameTag.direction === 'forward') {
        if (this._currentFrameIndex >= frameTag.to) {
          this._currentFrameIndex = frameTag.from
        } else {
          this._currentFrameIndex += 1
        }
      } else if (frameTag.direction === 'reverse') {
        if (this._currentFrameIndex <= frameTag.from) {
          this._currentFrameIndex = frameTag.to
        } else {
          this._currentFrameIndex -= 1
        }
      } else {
        // ping pong
        if (this._pingPongDirection === 'forward') {
          if (this._currentFrameIndex >= frameTag.to) {
            this._pingPongDirection = 'reverse'
            this._currentFrameIndex -= 1
          } else {
            this._currentFrameIndex += 1
          }
        } else {
          if (this._currentFrameIndex <= frameTag.from) {
            this._pingPongDirection = 'forward'
            this._currentFrameIndex += 1
          } else {
            this._currentFrameIndex -= 1
          }
        }
      }
    } else {
      this._currentFrameDuration += 16
    }

    return this.imageData.frames[this._currentFrameIndex]
  }

  get frameTags () {
    return this.imageData.meta.frameTags
  }

  get imageURL () {
    const imageURL = this.imageData.meta.image
    
    return imageURL.substring(imageURL.indexOf(this.baseURL))
  }

  get initialPosition () {
    if (this.options.initialPosition) {
      return {
        x: this.options.initialPosition.x - (this.size.x / 2),
        y: this.options.initialPosition.y - (this.size.y / 2),
      }
    }

    return {
      x: 0,
      y: 0,
    }
  }

  get size () {
    if (!this._size) {
      let size = this.options.size

      if (typeof size === 'string') {
        size = parseInt(size)
      }

      if (typeof size !== 'object') {
        if (isNaN(size)) {
          throw new Error('entity sizes MUST be ')
        }

        size = {
          x: size,
          y: size,
        }
      }

      this._size = size
    }

    return this._size
  }

  get state () {
    if ((this.body.velocity.x !== 0) || (this.body.velocity.y !== 0)) {
      return 'walk'
    }

    return 'idle'
  }

  get type () {
    return this.options.type
  }
}





export { Entity }