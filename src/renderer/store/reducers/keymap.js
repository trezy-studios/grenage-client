// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.keymap, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    default:
      return state
  }
}
