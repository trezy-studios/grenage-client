// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Local imports
import { actions } from '../../store'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  addItem: actions.inventory.addItem,
  destroyItem: actions.inventory.destroyItem,
  hideInventory: actions.ui.hideInventory,
  moveItem: actions.inventory.moveItem,
  showInventory: actions.ui.showInventory,
}, dispatch)
const mapStateToProps = ({ inventory }) => ({ inventory })





@connect(mapStateToProps, mapDispatchToProps)
class InventoryDebugPanel extends React.Component {
  render () {
    const {
      addItem,
      destroyItem,
      hideInventory,
      moveItem,
      showInventory,
    } = this.props

    return (
      <React.Fragment>
        <button onClick={showInventory}>
          Open Inventory
        </button>

        <button onClick={() => {
            addItem({
              name: 'Log',
              quantity: 10,
              weight: 3,
            })
          }}>
          Add 10x Logs
        </button>

        <button onClick={() => {
            addItem({
              name: 'Key',
              quality: 'Gold',
            })
          }}>
          Add Gold Key
        </button>

        <button onClick={() => {
            addItem({
              name: 'Key',
              quality: 'Rusty',
            })
          }}>
          Add Rusty Key
        </button>
      </React.Fragment>
    )
  }
}





export { InventoryDebugPanel }
