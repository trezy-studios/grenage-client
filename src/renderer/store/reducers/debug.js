// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'




export default function (state = initialState.debug, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.PING:
      return {
        ...state,
        ping: payload.pingDuration,
      }

    case actionTypes.SET_CONTROL_STATE:
      if (payload.control) {
        if (payload.key === '`') {
          return {
            ...state,
            enabled: !state.enabled,
          }
        }
      }

    case actionTypes.UPDATE_DEBUG_STATE:
      return {
        ...state,
        ...payload,
      }

    default:
      return state
  }
}
