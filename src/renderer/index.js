// Style imports
import './styles/reset.scss'
import './styles/app.scss'





// Module imports
import {
  library as faLibrary,
  config as faConfig,
} from '@fortawesome/fontawesome-svg-core'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'





// Local imports
import {
  ControlManager,
  GameRenderer,
} from './GameComponents'
import { initStore } from './store'
import { App } from './ReactComponents'
import * as faIcons from './helpers/faIconLibrary'





window.onload = () => {
  // Configure and populate FontAwesome library
  faLibrary.add(faIcons)

  // Create the React app
  ReactDOM.render(
    <Provider store={initStore()}>
      <App />
    </Provider>,
    document.querySelector('#app-root')
  )
}
