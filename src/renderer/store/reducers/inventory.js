// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'
import uuid from 'uuid/v4'





function getWeightAndQuantityFromItems (items) {
  return items.reduce((accumulator, item) => {
    if (item) {
      accumulator.totalQuantity += item.quantity
      accumulator.totalWeight += (item.weight * item.quantity) || 0
    }

    return accumulator
  }, {
    totalQuantity: 0,
    totalWeight: 0,
  })
}




export default function (state = initialState.inventory, action) {
  const {
    payload,
    type,
  } = action
  const newItemList = [...state.items]

  switch (type) {
    case actionTypes.ADD_ITEM:
      // Check to see if we already have a stack of this item type
      let existingStackIndex = newItemList.findIndex(item => {
        return item && (item.name === payload.item.name) && (item.quality === payload.item.quality)
      })

      // If we find an existing stack, just update the quantity and discard the
      // new item. Otherwise, generate a new ID for the new item and push it
      // into the first empty inventory slot.
      if (existingStackIndex > -1) {
        const existingStack = newItemList[existingStackIndex]

        newItemList[existingStackIndex] = {
          ...existingStack,
          quantity: existingStack.quantity + payload.item.quantity,
        }
      } else {
        if (!payload.item.id) {
          payload.item.id = uuid()
        }

        newItemList[newItemList.findIndex(item => !item)] = payload.item
      }

      return {
        ...state,
        ...getWeightAndQuantityFromItems(newItemList),
        items: newItemList,
      }

    case actionTypes.DESTROY_ITEM:
      const indexOfItemToDestroy = newItemList.findIndex(item => (item && (item.id === payload.item.id)))

      newItemList[indexOfItemToDestroy] = null

      return {
        ...state,
        ...getWeightAndQuantityFromItems(newItemList),
        items: newItemList,
      }

    case actionTypes.MOVE_ITEMS:
      for (const { destination, item, source } of payload.items) {
        if (newItemList[source].id === item.id) {
          newItemList[source] = null
        }

        newItemList[destination] = item
      }

      return {
        ...state,
        items: newItemList,
      }

    default:
      return state
  }
}
