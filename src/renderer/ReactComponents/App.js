// Module imports
import React from 'react'





// Local imports
import {
  ControlManager,
  GameRenderer,
} from '../GameComponents'
import {
  Login,
  Ping,
} from '.'





class App extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <main
        className="animate fade-in-from-bottom duration-2s"
        data-animate
        data-animation="fade-in-from-bottom"
        data-animation-duration="1s">
        <Login />

        <Ping />
      </main>
    )
  }
}





export { App }
