// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.playerEntity, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.ADD_ENTITY:
      if (payload.isPlayer) {
        return payload.entity
      }

      return state

    default:
      return state
  }
}
