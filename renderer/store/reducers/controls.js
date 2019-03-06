// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'




export default function (state = initialState.controls, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.SET_KEY_STATE:
      const {
        key,
        state: keyState,
      } = payload

      return {
        ...state,
        [key]: keyState,
      }

    default:
      return state
  }
}
