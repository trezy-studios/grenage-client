// Module imports
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import React from 'react'





// Local imports
import {
  ControlManager,
  GameRenderer,
} from '../GameComponents'
import { actions } from '../store'
import {
  Login,
  Ping,
} from '.'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  ping: actions.debug.ping,
}, dispatch)





@connect(null, mapDispatchToProps)
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

  _startPing = () => {
    const { ping } = this.props
    setInterval(ping, 1000)
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  componentDidMount () {
    this._startPing()
  }

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
