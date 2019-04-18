// Local imports
import actionTypes from '../actionTypes'





const setControlState = (key, isPressed, source = 'keyboard') => async (dispatch, getState) => {
  const {
    controls,
    keymap,
  } = getState()
  const keymapping = keymap[source][key]
  let shouldDispatch = false
  let controlState = null

  if (keymapping) {
    switch (controls[keymapping.mapping].type) {
      case 'hold':
        shouldDispatch = true
        controlState = isPressed
        break

      case 'press':
      case 'toggle':
        if (isPressed) {
          shouldDispatch = true
          controlState = !controls[keymapping.mapping].isActive
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
      type: actionTypes.SET_CONTROL_STATE,
    })
  }
}

const unsetPressControls = () => async (dispatch, getState) => {
  const { controls } = getState()
  const controlUpdates = {}
  let shouldDispatch = false

  for (const [control, controlState] of Object.entries(controls)) {
    if (controlState.type === 'press' && controlState.isActive) {
      controlUpdates[control] = false
      shouldDispatch = true
    }
  }

  if (shouldDispatch) {
    dispatch({
      payload: { controlUpdates },
      type: actionTypes.UNSET_PRESS_CONTROLS,
    })
  }
}





export {
  setControlState,
  unsetPressControls,
}
