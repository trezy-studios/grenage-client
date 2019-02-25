// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Local imports
import { actions } from '../../store'





// Local constants
const mapStateToProps = ({ entities }) => ({ entities })





@connect(mapStateToProps)
class SpritesDebugPanel extends React.Component {
  render () {
    const { entities } = this.props

    return (
      <React.Fragment>
        <ul>
          {Object.values(entities).map(entity => (
            <li key={entity.id}>
              <header>{entity.body.label}</header>

              <img src={entity.body.render.image.src} />
            </li>
          ))}
        </ul>
      </React.Fragment>
    )
  }
}





export { SpritesDebugPanel }














const Inventory = () => (
  <div className="debugger">
    {/* <button onClick={actions.inventory.showInventory}>
      Open Inventory
    </button>

    <button onClick={() => {
        actions.inventory.addItem({
          name: 'Log',
          quantity: 10,
          weight: 3,
        })
      }}>
      Add 10x Logs
    </button>

    <button onClick={() => {
        actions.inventory.addItem({
          name: 'Key',
          quality: 'Gold',
        })
      }}>
      Add Gold Key
    </button>

    <button onClick={() => {
        actions.inventory.addItem({
          name: 'Key',
          quality: 'Rusty',
        })
      }}>
      Add Rusty Key
    </button> */}
  </div>
)





export { Inventory }
