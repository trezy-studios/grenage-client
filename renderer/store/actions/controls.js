// Local imports
import actionTypes from '../actionTypes'





const setKeyState = (key, state) => async dispatch => {
  dispatch({
    payload: {
      key,
      state,
    },
    type: actionTypes.SET_KEY_STATE,
  })
}





export {
  setKeyState,
}
