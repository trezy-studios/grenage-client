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



const updateWindowSize = (width, height) => async dispatch => {
  dispatch({
    payload: { height, width },
    type: actionTypes.UPDATE_WINDOW_SIZE,
  })
}





export {
  hideInventory,
  showInventory,
  updateWindowSize,
}
