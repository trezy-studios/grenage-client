// Module imports
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classnames from 'classnames'
import React from 'react'





// Local imports
import { actions } from '../store'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  ping: actions.debug.ping,
}, dispatch)
const mapStateToProps = ({ debug: { ping } }) => ({ currentPing: ping })





@connect(mapStateToProps, mapDispatchToProps)
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

  _startPing = () => {
    const { ping } = this.props
    setInterval(ping, 1000)
  }



  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    const { ping } = this.props
    this.pingIntervalID = setInterval(ping, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.pingIntervalID)
  }

  render () {
    const { currentPing } = this.props

    return (
      <div id="ping">
        <div
          id="ping-meter"
          data-value={this._getPingRating(currentPing)}
          title="ms">
          <div className="ping-bar" />
          <div className="ping-bar" />
          <div className="ping-bar" />
          <div className="ping-bar" />
          <div className="ping-bar" />
        </div>

        <time dateTime={`PT${currentPing / 1000}S`}>
          {this._markupPingString(currentPing)}
        </time>
      </div>
    )
  }
}





export { Ping }
