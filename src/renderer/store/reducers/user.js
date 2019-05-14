// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'




export default function (state = initialState.user, action) {
  const {
    payload,
    type,
  } = action
  let newState = { ...state }

  switch (type) {
    case actionTypes.LOGIN:
      newState = {
        ...newState,
        ...payload,
        isLoggedIn: true,
      }
      return newState

    default:
      return state
  }
}
