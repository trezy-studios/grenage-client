// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Local imports
import { actions } from '../../store'
import { DebugPanel } from '.'





// Local constants
const mapStateToProps = ({ entities }) => ({ entities })





@connect(mapStateToProps)
class SpritesDebugPanel extends React.Component {
  componentDidMount () {
    this.observer = new MutationObserver((mutationsList, observer) => {
      console.log(mutationsList, observer)
      this.forceUpdate()
    })
  }

  componentDidUpdate (previousProps) {
    if (previousProps.entities !== this.props.entities) {
      this.observer.disconnect()

      for (const entity of Object.values(this.props.entities)) {
        this.observer.observe(entity.render.image, { attributes: true })
      }
    }
  }

  render () {
    const { entities } = this.props

    return (
      <DebugPanel title="Sprites">
        <ul>
          {Object.values(entities).map(entity => (
            <li key={entity.id}>
              <header>{entity.label}</header>

              <img src={entity.render.imageURL} />
            </li>
          ))}
        </ul>
      </DebugPanel>
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
