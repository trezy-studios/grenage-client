// Module imports
import ElectronStore from 'electron-store'
import fs from 'fs'
import path from 'path'





// Local constants
const localStore = new ElectronStore
const keymapsPath = path.resolve(__dirname, '..', '..', '..', 'keymaps')
const keymapOverrides = localStore.get('keymaps', {})





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
    currentPing: 0,
    enabled: false,
    previousPing: 0,
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

  keymap: fs.readdirSync(keymapsPath).reduce((accumulator, filename) => {
    const keymap = JSON.parse(fs.readFileSync(path.resolve(keymapsPath, filename), 'utf8'))

    for (const gamepadID of keymap.ids) {
      accumulator[gamepadID] = {
        ...keymap.map,
        ...(keymapOverrides[gamepadID] || {}),
      }
    }

    return accumulator
  }, {}),

  playerEntityID: null,

  ui: {
    height: 0,
    inventory: {
      isVisible: false,
    },
    width: 0,
  },

  user: {
    accessToken: null,
    isLoggedIn: false,
    user: null,
  },

  ...localStore.get('state', {}),
}





initialState.inventory.items.fill(null)





export default initialState
