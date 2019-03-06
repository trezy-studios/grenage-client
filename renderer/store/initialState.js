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

  debug: {
    enabled: false,
    showAllBodies: false,
    wireframesShowEntityAnchorPoints: false,
    wireframesShowEntityBoundingBox: false,
    wireframesShowMapViewBoundingBox: false,
  },

  entities: {},

  inventory: {
    items: new Array(16),
    totalQuantity: 0,
    totalSlots: 16,
    totalWeight: 0,
  },

  playerEntity: null,

  ui: {
    inventory: {
      isVisible: false,
    },
  },
}





initialState.inventory.items.fill(null)





export default initialState
