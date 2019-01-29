// Local imports
import actionTypes from '../actionTypes'





const addItem = (item, slot) => async dispatch => {
  if (!item.quantity) {
    item.quantity = 1
  }

  dispatch({
    payload: {
      item,
      slot,
    },
    type: actionTypes.ADD_ITEM,
  })
}





const destroyItem = item => async dispatch => {
  dispatch({
    payload: { item },
    type: actionTypes.DESTROY_ITEM,
  })
}





const moveItems = items => async dispatch => {
  dispatch({
    payload: { items },
    type: actionTypes.MOVE_ITEMS,
  })
}





export {
  addItem,
  destroyItem,
  moveItems,
}
