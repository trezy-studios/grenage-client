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
  const newState = { ...state }

  switch (type) {
    case actionTypes.ADD_ENTITY:
      newState[payload.entity.id] = payload.entity
      return newState

    case actionTypes.REMOVE_ENTITY:
      delete newState[payload.id]
      return newState

    default:
      return state
  }
}
