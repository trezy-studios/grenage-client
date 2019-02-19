// Module imports
import uuid from 'uuid/v4'





// Component imports
import { Entity } from '../../GameComponents'
import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.entities, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.ADD_ENTITY:
      return {
        ...state,
        [payload.entity.render.id]: payload.entity,
      }

    default:
      return state
  }
}
