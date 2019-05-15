// Module imports
import { connect } from 'react-redux'
import classnames from 'classnames'
import React from 'react'





// Local constants
const mapStateToProps = ({ debug: { ping } }) => ({ ping })





@connect(mapStateToProps)
class Ping extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _getPingRating = ping => (5 - Math.floor(5 * ping / 200)) || 1

  _markupPingString = ping => {
    const paddedString = ping.toString().padStart(3, '0')

    const { result } = paddedString.split('').reduce(this._markupPingStringReducer, {
      isPadding: true,
      result: [],
    })

    return [...result, 'ms']
  }

  _markupPingStringReducer = (accumulator, character, index) => {
    if (accumulator.isPadding && character !== '0') {
      accumulator.isPadding = false
    }

    accumulator.result.push(
      <span
        className={classnames({
          'text-muted': accumulator.isPadding && character === '0',
        })}
        key={index}>
        {character}
      </span>
    )

    return accumulator
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const { ping } = this.props

    return (
      <div id="ping">
        <div
          id="ping-meter"
          data-value={this._getPingRating(ping)}
          title="ms">
          <div className="ping-bar" />
          <div className="ping-bar" />
          <div className="ping-bar" />
          <div className="ping-bar" />
          <div className="ping-bar" />
        </div>

        <time dateTime={`PT${ping / 1000}S`}>
          {this._markupPingString(ping)}
        </time>
      </div>
    )
  }
}





export { Ping }
