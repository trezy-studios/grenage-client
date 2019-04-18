// Module imports
import uuid from 'uuid/v4'





// Local imports
import { fetchJSON } from '../../helpers'
import actionTypes from '../actionTypes'





const addEntity = options => async dispatch => {
  const {
    initialPosition,
    isPlayer,
    type,
  } = options

  const [entityData, statBlock] = await Promise.all([
    fetchJSON(`/entities/${type}.json`),
    fetchJSON(`/stat-blocks/${type}.json`),
  ])

  // const entity = new Entity({
  //   initialPosition,
  //   label: (isPlayer ? 'player' : type),
  //   type,
  // })

  return dispatch({
    payload: {
      entity: {
        entityData,
        id: uuid(),
        label: (isPlayer ? 'player' : type),
        position: initialPosition,
        stats: statBlock,
        ...entityData.meta.slices.reduce((accumulator, slice) => {
          if (/^environmental-hitbox/gi.test(slice.name)) {
            accumulator.environmentalHitboxes.push(slice)
          } else if (/^hitbox/gi.test(slice.name)) {
            accumulator.hitboxes.push(slice)
          } else if (/^zone/gi.test(slice.name)) {
            accumulator.zones.push(slice)
          }

          return accumulator
        }, {
          environmentalHitboxes: [],
          hitboxes: [],
          zones: [],
        })
      },
      isPlayer,
    },
    type: actionTypes.ADD_ENTITY,
  })
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
