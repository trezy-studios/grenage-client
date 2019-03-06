// Local imports
import actionTypes from '../actionTypes'
import { Entity } from '../../GameComponents'





const addEntity = entityData => async dispatch => {
  const {
    initialPosition,
    isPlayer,
    size,
    type,
  } = entityData

  const entity = new Entity({
    initialPosition,
    label: (isPlayer ? 'player' : type),
    size: size || 32,
    type,
  })

  dispatch({
    payload: {
      entity,
      isPlayer,
    },
    type: actionTypes.ADD_ENTITY,
  })
}





export {
  addEntity,
}
