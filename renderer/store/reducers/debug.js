// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'




export default function (state = initialState.debug, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.UPDATE_DEBUG_STATE:
      return {
        ...state,
        ...payload,
      }

    default:
      return state
  }
}
