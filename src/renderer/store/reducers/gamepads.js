// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.gamepads, action) {
  const {
    payload,
    type,
  } = action
  const newState = { ...state }

  switch (type) {
    case actionTypes.ADD_GAMEPAD:
      return {
        ...state,
        ...payload,
      }

    case actionTypes.REMOVE_GAMEPAD:
      delete newState[payload.gamepad.index]
      return newState

    case actionTypes.UPDATE_GAMEPADS:
      for (const { gamepad } of payload.gamepadsPatch) {
        newState[gamepad.index] = gamepad
      }

      return newState

    default:
      return state
  }
}
