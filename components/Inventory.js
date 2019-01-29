// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Local imports
import { actions } from '../store'
import {
  Icon,
  InventoryItemSlot,
} from '.'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  addItem: actions.inventory.addItem,
  destroyItem: actions.inventory.destroyItem,
  hideInventory: actions.ui.hideInventory,
}, dispatch)
const mapStateToProps = ({ inventory }) => ({ inventory })





@connect(mapStateToProps, mapDispatchToProps)
class Inventory extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      hideInventory,
      inventory,
      open,
    } = this.props

    return (
      <dialog
        className="inventory"
        open={open}>
        <header>
          <h2>Backpack</h2>

          <menu type="toolbar">
            <button onClick={hideInventory}>
              <Icon icon="x" />
            </button>
          </menu>
        </header>

        <p>You have {inventory.totalQuantity} items in your backpack.</p>

        <ol className="four-columns grid hide-if-empty">
          {inventory.items.map((item, index) => (
            <InventoryItemSlot
              item={item}
              key={item ? item.id : index}
              slot={index} />
          ))}
        </ol>
      </dialog>
    )
  }
}





export { Inventory }
