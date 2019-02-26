// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'
import uuid from 'uuid/v4'





// Local imports
import { actions } from '../../store'
import { Switch } from '..'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  updateDebugState: actions.debug.updateDebugState,
}, dispatch)
const mapStateToProps = ({ debug }) => ({ ...debug })





@connect(mapStateToProps, mapDispatchToProps)
class WireframesDebugPanel extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleInputChange = ({ target }) => {
    let value = target.value

    if (target.type === 'checkbox') {
      value = target.checked
    }

    this.props.updateDebugState(target.name, value)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const inputs = [
      {
        id: uuid(),
        label: 'Show entity anchor points',
        property: 'wireframesShowEntityAnchorPoints',
      },
      {
        id: uuid(),
        label: 'Show entity bounding box',
        property: 'wireframesShowEntityBoundingBox',
      },
      {
        id: uuid(),
        label: 'Show view bounding box',
        property: 'wireframesShowMapViewBoundingBox',
      },
    ]

    return (
      <React.Fragment>
        {inputs.map(({ id, label, property }) => (
          <fieldset key={id}>
            <Switch
              checked={this.props[property]}
              id={`debugger-${property}`}
              name={property}
              onChange={this._handleInputChange} />

            <label htmlFor={`debugger-${property}`}>
              {label}
            </label>
          </fieldset>
        ))}
      </React.Fragment>
    )
  }
}





export { WireframesDebugPanel }
