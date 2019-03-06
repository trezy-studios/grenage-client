// Local imports
import actionTypes from '../actionTypes'





const hideInventory = () => async dispatch => {
  dispatch({
    type: actionTypes.HIDE_INVENTORY,
  })
}





const showInventory = () => async dispatch => {
  dispatch({
    type: actionTypes.SHOW_INVENTORY,
  })
}





export {
  hideInventory,
  showInventory,
}
