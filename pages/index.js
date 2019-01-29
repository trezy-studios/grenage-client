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
import {
  StatsDebugPanel,
  InventoryDebugPanel,
} from '../components/DebugPanels'





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
      ui,
    } = this.props

    return (
      <React.Fragment>
        <Inventory open={ui.inventory.isVisible} />

        {query.debug && (
          <StatsDebugPanel />
        )}

        {query.debug && (
          <InventoryDebugPanel />
        )}
      </React.Fragment>
    )
  }
}





export default Game
