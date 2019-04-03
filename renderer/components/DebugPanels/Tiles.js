// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'





// Local imports
import { actions } from '../../store'





// Local constants
const mapStateToProps = ({ entities }) => ({ entities })





@connect(mapStateToProps)
class TilesDebugPanel extends React.Component {
  render () {
    const { maps } = window

    return (
      <React.Fragment>
        <ul className="inline">
          {Object.entries(maps[0].tiles).map(([id, { height, image, width, x, y }]) => (
            <li
              key={id}
              data-id={id}>
              <svg
                title={id}
                height={height}
                viewBox={`${x} ${y} ${width} ${height}`}
                width={width}>
                <image
                  height={image.height}
                  width={image.width}
                  x="0"
                  xlinkHref={image.src}
                  y="0" />
              </svg>
            </li>
          ))}
        </ul>
      </React.Fragment>
    )
  }
}





export { TilesDebugPanel }