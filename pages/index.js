// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Local imports
import { actions } from '../store'
import {
  FPSMeter,
  Inventory,
} from '../components'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  addItem: actions.inventory.addItem,
  showInventory: actions.ui.showInventory,
}, dispatch)
const mapStateToProps = ({ ui }) => ({ ui })





@connect(mapStateToProps, mapDispatchToProps)
class Game extends React.Component {
  render () {
    const {
      query,
      showInventory,
      ui,
    } = this.props

    return (
      <div>
        <Inventory open={ui.inventory.isVisible} />

        {query.debug && (
          <FPSMeter />
        )}

        <button onClick={showInventory}>
          Open Inventory
        </button>

        <button onClick={() => {
            this.props.addItem({
              name: 'Log',
              quantity: 10,
              weight: 3,
            })
          }}>
          Add 10x Logs
        </button>

        <button onClick={() => {
            this.props.addItem({
              name: 'Key',
              quality: 'Gold',
            })
          }}>
          Add Gold Key
        </button>

        <button onClick={() => {
            this.props.addItem({
              name: 'Key',
              quality: 'Rusty',
            })
          }}>
          Add Rusty Key
        </button>
      </div>
    )
  }
}





export default Game
