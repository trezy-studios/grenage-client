// Module imports
import axios from 'axios'





// Local imports
import actionTypes from '../actionTypes'





const updateDebugState = (key, value) => async dispatch => {
  dispatch({
    payload: { [key]: value },
    type: actionTypes.UPDATE_DEBUG_STATE,
  })
}





const ping = () => async dispatch => {
  let pingStart = performance.now()

  await axios.get('http://localhost:3001/ping')

  let pingEnd = performance.now()

  dispatch({
    payload: {
      pingDuration: parseInt(pingEnd - pingStart),
    },
    type: actionTypes.PING,
  })
}





export {
  ping,
  updateDebugState,
}
