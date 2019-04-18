// Module imports
import ElectronStore from 'electron-store'
import React from 'react'
import ReactDOM from 'react-dom'





// Local imports
import {
  ControlManager,
  GameRenderer,
} from './GameComponents'
import { LoginApp } from './ReactComponents'





// Local constants
const localStore = new ElectronStore({
  schema: {
    user: {
      properties: {
        accessToken: {
          default: null,
          type: ['null', 'string'],
        },
        email: {
          format: 'email',
          type: ['null', 'string'],
        },
        loggedIn: {
          default: false,
          type: 'boolean',
        },
      },
      type: 'object',
    },
  },
})





class Game {
  initialize = () => {
    if (!localStore.get('user.accessToken')) {
      const target = document.querySelector('#game-root')

      ReactDOM.render(<LoginApp />, target)
    }

    // new GameRenderer({
    //   element: document.querySelector('#game-root'),
    // })

    // new ControlManager()
  }
}


export { Game }
