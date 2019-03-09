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
const mapStateToProps = ({ controls }) => ({ controls })





@connect(mapStateToProps)
class Home extends React.Component {
  render () {
    const {
      query,
      controls,
    } = this.props

    return (
      <React.Fragment>
        <Game />

        <Inventory open={controls.inventory.isActive} />

        <GameDebugger />
      </React.Fragment>
    )
  }
}





export default Home
