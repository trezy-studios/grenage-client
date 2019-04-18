// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.playerEntityID, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.ADD_ENTITY:
      if (payload.isPlayer) {
        return payload.entity.id
      }

      return state

    default:
      return state
  }
}
