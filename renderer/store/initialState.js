// Module imports
import getConfig from 'next/config'





// Local constants
const { publicRuntimeConfig } = getConfig()





const initialState = {
  controls: {
    // actions
    attack: {
      isActive: false,
      type: 'press',
    },

    // movement
    east: {
      isActive: false,
      type: 'hold',
    },
    north: {
      isActive: false,
      type: 'hold',
    },
    south: {
      isActive: false,
      type: 'hold',
    },
    west: {
      isActive: false,
      type: 'hold',
    },

    // movement modifiers
    sneak: {
      isActive: false,
      type: 'hold',
    },
    sprint: {
      isActive: false,
      type: 'hold',
    },

    // ui
    openDebugger: {
      isActive: false,
      type: 'toggle',
    },
    closeDebugger: {
      isActive: false,
      type: 'toggle',
    },
    closeInventory: {
      isActive: false,
      type: 'toggle',
    },
    openInventory: {
      isActive: false,
      type: 'toggle',
    },

    inventory: {
      isActive: false,
      type: 'toggle',
    },
  },

  debug: {
    enabled: false,
    showAllBodies: false,
    wireframesShowEntityAnchorPoints: false,
    wireframesShowEntityBoundingBox: false,
    wireframesShowEntityEnvironmentalHitbox: false,
    wireframesShowEntityHitbox: false,
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
