// Local imports
import actionTypes from '../actionTypes'





const login = (email, password) => async dispatch => {


  dispatch({
    payload: {
      accessToken,
      email,
    },
    type: actionTypes.LOGIN,
  })
}





export {
  login,
}
