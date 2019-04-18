// Local imports
import { isNumberInRange } from '../../helpers'
import actionTypes from '../actionTypes'





const addGamepad = gamepad => async dispatch => {
  dispatch({
    payload: { [gamepad.index]: gamepad },
    type: actionTypes.ADD_GAMEPAD,
  })
}

const removeGamepad = gamepad => async dispatch => {
  dispatch({
    payload: { gamepad },
    type: actionTypes.REMOVE_GAMEPAD,
  })
}

const updateGamepads = gamepadsPatch => async (dispatch, getState) => {
  const {
    controls,
    keymap,
  } = getState()
  const controlUpdates = {}

  for (const { changes, gamepad } of gamepadsPatch) {
    for (const [key, value] of Object.entries(changes)) {
      const keymapping = (keymap[gamepad.id] || {})[key]

      if (keymapping) {
        for (const mapping of keymapping) {
          if (mapping.range) {
            controlUpdates[mapping.mapping] = isNumberInRange(value, mapping.range)
          } else {
            switch (controls[mapping.mapping].type) {
              case 'hold':
                controlUpdates[mapping.mapping] = value.pressed
                break

              case 'press':
              case 'toggle':
                if (value.pressed) {
                  controlUpdates[mapping.mapping] = !controls[mapping.mapping].isActive
                }
                break
            }
          }
        }
      }
    }
  }

  dispatch({
    payload: {
      controlUpdates,
      gamepadsPatch,
    },
    type: actionTypes.UPDATE_GAMEPADS,
  })
}





export {
  addGamepad,
  removeGamepad,
  updateGamepads,
}
