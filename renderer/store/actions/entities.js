// Local imports
import actionTypes from '../actionTypes'
import { Entity } from '../../GameComponents'





const addEntity = entityData => dispatch => {
  const {
    initialPosition,
    isPlayer,
    type,
  } = entityData

  const entity = new Entity({
    initialPosition,
    label: (isPlayer ? 'player' : type),
    type,
  })

  dispatch({
    payload: {
      entity,
      isPlayer,
    },
    type: actionTypes.ADD_ENTITY,
  })

  return entity
}

const removeEntity = id => async dispatch => {
  dispatch({
    payload: { id },
    type: actionTypes.REMOVE_ENTITY,
  })
}





export {
  addEntity,
  removeEntity,
}
