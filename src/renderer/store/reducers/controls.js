// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.controls, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.SET_CONTROL_STATE:
      return {
        ...state,
        [payload.control]: {
          ...state[payload.control],
          isActive: payload.controlState,
        }
      }

    case actionTypes.UNSET_PRESS_CONTROLS:
    case actionTypes.UPDATE_GAMEPADS:
      return {
        ...state,
        ...Object.entries(payload.controlUpdates).reduce((accumulator, [control, isActive]) => {
          accumulator[control] = {
            ...state[control],
            isActive,
          }
          return accumulator
        }, {}),
      }

    default:
      return state
  }
}
