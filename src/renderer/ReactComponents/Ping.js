// Module imports
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classnames from 'classnames'
import CountUp from 'react-countup'
import React from 'react'





// Local imports
import { actions } from '../store'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  ping: actions.debug.ping,
}, dispatch)
const mapStateToProps = ({
  debug: {
    currentPing,
    previousPing,
  },
}) => ({
  currentPing,
  previousPing,
})





@connect(mapStateToProps, mapDispatchToProps)
class Ping extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _getPingRating = ping => (5 - Math.floor(5 * ping / 200)) || 1

  _markupPingString = ping => {
    const paddedString = ping.toString().padStart(3, '0')

    const { result } = paddedString.split('').reduce((accumulator, character) => {
      if (accumulator.isPadding && character !== '0') {
        accumulator.isPadding = false
      }

      const classes = classnames({
        'text-muted': accumulator.isPadding && character === '0',
      })

      accumulator.result += `<span class="${classes}">${character}</span>`

      return accumulator
    }, {
      isPadding: true,
      result: '',
    })

    return `${result}ms`
  }



  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.pingIntervalID = setInterval(this.props.ping, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.pingIntervalID)
  }

  render () {
    const {
      currentPing,
      previousPing,
    } = this.props

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

        {/* <span>Connecting...</span> */}

        {/* <span>No connection</span> */}

        <time dateTime={`PT${currentPing / 1000}S`}>
          <CountUp
            duration={1}
            end={currentPing}
            formattingFn={this._markupPingString}
            start={previousPing} />
        </time>
      </div>
    )
  }
}





export { Ping }
