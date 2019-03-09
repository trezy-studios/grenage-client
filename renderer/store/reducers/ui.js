// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'




export default function (state = initialState.ui, action) {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.HIDE_INVENTORY:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          isVisible: false,
        },
      }

    case actionTypes.SHOW_INVENTORY:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          isVisible: true,
        },
      }

    case actionTypes.SET_CONTROL_STATE:
      if (payload.control) {
        if (payload.control === 'closeInventory' && state.inventory.isVisible) {
          return {
            ...state,
            inventory: {
              ...state.inventory,
              isVisible: false,
            },
          }
        }

        if (payload.control === 'openInventory' && !state.inventory.isVisible) {
          return {
            ...state,
            inventory: {
              ...state.inventory,
              isVisible: payload.controlState,
            },
          }
        }
      }

    default:
      return state
  }
}
