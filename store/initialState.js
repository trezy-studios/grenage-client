const initialState = {
  controls: {
    ' ': false,
    a: false,
    control: false,
    d: false,
    s: false,
    shift: false,
    w: false,
  },

  inventory: {
    items: new Array(16),
    totalQuantity: 0,
    totalSlots: 16,
    totalWeight: 0,
  },

  ui: {
    inventory: {
      isVisible: false,
    },
  },
}





initialState.inventory.items.fill(null)





export default initialState
