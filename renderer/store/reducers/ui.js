// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'




export default function (state = initialState.ui, action) {
  const { type } = action

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

    default:
      return state
  }
}
