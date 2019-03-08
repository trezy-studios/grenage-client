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
      return {
        ...state,
        [payload.control]: payload.controlState,
      }

    case actionTypes.UPDATE_GAMEPADS:
      return {
        ...state,
        ...payload.controlUpdates,
      }

    default:
      return state
  }
}
