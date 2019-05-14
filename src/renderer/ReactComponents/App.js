// Module imports
import React from 'react'





// Local imports
import {
  ControlManager,
  GameRenderer,
} from '../GameComponents'
import { Login } from '.'





class App extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _startGame = () => {
    this.gameRenderer = new GameRenderer({
      element: document.querySelector('#game-root'),
    })

    this.controlManager = new ControlManager()
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  render () {
    return (
      <Login />
    )
  }
}





export { App }
