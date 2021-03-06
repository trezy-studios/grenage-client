// Style imports
import './styles/reset.scss'
import './styles/app.scss'





// Module imports
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





window.onload = () => {
  // Create the React app
  ReactDOM.render(
    <Provider store={initStore()}>
      <App />
    </Provider>,
    document.querySelector('#app-root')
  )
}
