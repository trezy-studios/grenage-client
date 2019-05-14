// Style imports
import './styles/reset.css'
import './styles/app.css'





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
  ReactDOM.render(
    <Provider store={initStore()}>
      <App />
    </Provider>,
    document.querySelector('#app-root')
  )
}
