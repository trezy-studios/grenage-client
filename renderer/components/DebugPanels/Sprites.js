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
