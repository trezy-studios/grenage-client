// Module imports
import { bindActionCreators } from 'redux'
import { Body } from 'matter-js'
import { connect } from 'react-redux'
import React from 'react'
import uuid from 'uuid/v4'





// Local imports
import { actions } from '../../store'
import { Switch } from '..'





// Local constants
const mapStateToProps = ({ playerEntity }) => ({ playerEntity })





@connect(mapStateToProps)
class PlayerDebugPanel extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  state = {
    speed: this.props.playerEntity.body.position.speed,
    teleportX: 0,
    teleportY: 0,
    x: this.props.playerEntity.body.position.x,
    y: this.props.playerEntity.body.position.y,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleTeleportDestinationChange = ({ target }) => {
    this.setState({
      [target.name]: parseInt(target.value || 0),
    })
  }

  _handleTeleport = event => {
    const {
      teleportX,
      teleportY,
    } = this.state

    event.preventDefault()

    Body.setPosition(this.props.playerEntity.body, {
      x: teleportX,
      y: teleportY,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentWillMount () {
    this.props.playerEntity.body = new Proxy(this.props.playerEntity.body, {
      set: (object, property, value) => {
        object[property] = value
        
        if (property === 'speed') {
          this.setState({ speed: value })
        }

        return true
      },
    })

    this.props.playerEntity.body.position = new Proxy(this.props.playerEntity.body.position, {
      set: (object, property, value) => {
        object[property] = value

        this.setState(object)

        return true
      },
    })
  }

  render () {
    const {
      speed: playerSpeed,
      teleportX,
      teleportY,
      x: playerX,
      y: playerY,
    } = this.state

    return (
      <React.Fragment>
        <fieldset>
          <legend>Current Position</legend>

          <label htmlFor="currentPlayerPositionX">
            x
          </label>

          <input
            id="currentPlayerPositionX"
            readOnly
            value={playerX}
            type="number" />

          <label htmlFor="currentPlayerPositionY">
            y
          </label>

          <input
            id="currentPlayerPositionY"
            readOnly
            value={playerY}
            type="number" />

          <label htmlFor="currentPlayerSpeed">
            Current Speed
          </label>

          <input
            id="currentPlayerSpeed"
            readOnly
            value={playerSpeed}
            type="number" />
        </fieldset>

        <form onSubmit={this._handleTeleport}>
          <fieldset>
            <legend>Teleport</legend>

            <label htmlFor="teleportDestinationX">
              x
            </label>

            <input
              id="teleportDestinationX"
              name="teleportX"
              onChange={this._handleTeleportDestinationChange}
              type="number"
              value={teleportX} />

            <label htmlFor="teleportDestinationY">
              y
            </label>

            <input
              id="teleportDestinationY"
              name="teleportY"
              onChange={this._handleTeleportDestinationChange}
              type="number"
              value={teleportY} />

            <button type="submit">
              Teleport!
            </button>
          </fieldset>
        </form>
      </React.Fragment>
    )
  }
}





export { PlayerDebugPanel }
