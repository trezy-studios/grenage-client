// Local imports
import actionTypes from '../actionTypes'





const updateDebugState = (key, value) => async dispatch => {
  dispatch({
    payload: { [key]: value },
    type: actionTypes.UPDATE_DEBUG_STATE,
  })
}





export { updateDebugState }
