// Module imports
import {
  Bodies,
  Body,
} from 'matter-js'
import TWEEN from '@tweenjs/tween.js'
import uuid from 'uuid/v4'





class FloatingText {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  enterTween = undefined

  exitTween = undefined





  /***************************************************************************\
    Private Methods
  \***************************************************************************/





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (options) {
    this.options = options

    this.exitTween = new TWEEN.Tween(this.states[1])
    this.exitTween.to(this.states[2], 500)
    this.exitTween.easing(TWEEN.Easing.Quadratic.Out)
    this.exitTween.onUpdate(this.onUpdate)

    this.enterTween = new TWEEN.Tween(this.states[0])
    this.enterTween.to(this.states[1], 500)
    this.enterTween.easing(TWEEN.Easing.Quadratic.Out)
    this.enterTween.chain(this.exitTween)
    this.enterTween.start()
    this.enterTween.onUpdate(this.onUpdate)
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get onUpdate () {
    return this.options.onUpdate
  }

  get states () {
    if (!this._states) {
      this._states = [
        {
          ...this.options.origin,
          opacity: 0,
        },
        {
          ...this.options.destination,
          opacity: 1,
        },
        {
          ...this.options.destination,
          opacity: 0,
        },
      ]
    }

    return this._states
  }
}





export { FloatingText }
