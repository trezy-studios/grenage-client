// Local imports
import actionTypes from '../actionTypes'





const setKeyState = (key, isPressed, source = 'keyboard') => async (dispatch, getState) => {
  const {
    controls,
    keymap,
  } = getState()
  const keymapping = keymap[source][key]
  let shouldDispatch = false
  let controlState = null

  if (keymapping) {
    switch (keymapping.type) {
      case 'hold':
        shouldDispatch = true
        controlState = isPressed
        break

      case 'toggle':
        if (isPressed) {
          shouldDispatch = true
          controlState = !controls[keymapping.mapping]
        }
        break
    }
  }

  if (shouldDispatch) {
    dispatch({
      payload: {
        control: keymapping.mapping,
        controlState: controlState,
        key,
      },
      type: actionTypes.SET_KEY_STATE,
    })
  }
}





export {
  setKeyState,
}
