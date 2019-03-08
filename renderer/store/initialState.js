// Module imports
import getConfig from 'next/config'





// Local constants
const { publicRuntimeConfig } = getConfig()





const initialState = {
  controls: {
    // actions
    attack: false,

    // movement
    east: false,
    north: false,
    south: false,
    west: false,

    // movement modifiers
    sneak: false,
    sprint: false,

    // ui
    openDebugger: false,
    closeDebugger: false,
    closeInventory: false,
    openInventory: false,

    inventory: false,
  },

  debug: {
    enabled: false,
    showAllBodies: false,
    wireframesShowEntityAnchorPoints: false,
    wireframesShowEntityBoundingBox: false,
    wireframesShowMapViewBoundingBox: false,
  },

  entities: {},

  gamepads: {},

  inventory: {
    items: new Array(16),
    totalQuantity: 0,
    totalSlots: 16,
    totalWeight: 0,
  },

  keymap: publicRuntimeConfig.keymaps,

  playerEntity: null,

  ui: {
    inventory: {
      isVisible: false,
    },
  },
}





initialState.inventory.items.fill(null)





export default initialState
