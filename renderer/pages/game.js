// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Local imports
import { actions } from '../store'
import {
  Game,
  GameDebugger,
  Inventory,
} from '../components'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  addItem: actions.inventory.addItem,
  showInventory: actions.ui.showInventory,
}, dispatch)
const mapStateToProps = ({ ui }) => ({ ui })





@connect(mapStateToProps, mapDispatchToProps)
class Home extends React.Component {
  render () {
    const {
      query,
      ui,
    } = this.props

    return (
      <React.Fragment>
        <Game />

        <Inventory open={ui.inventory.isVisible} />

        {query.debug && (
          <GameDebugger query={query} />
        )}
      </React.Fragment>
    )
  }
}





export default Home
