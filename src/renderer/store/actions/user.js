// Local imports
import actionTypes from '../actionTypes'
import axios from 'axios'





const login = (email, password) => async dispatch => {
  let response = null

  try {
    response = await axios.post('http://localhost:3001/auth/login', {
      email,
      password,
    })

    const { data: results } = response

    const accessToken = results.data.attributes.token
    const userID = results.data.relationships.user.data.id
    const user = results.included.find(({ id }) => id === userID)

    dispatch({
      payload: {
        accessToken,
        user,
      },
      type: actionTypes.LOGIN,
    })
  } catch (error) {
    dispatch({
      payload: null,
      type: actionTypes.LOGIN_ERROR,
    })
  }
}





export {
  login,
}
