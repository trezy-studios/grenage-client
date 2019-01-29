// Module imports
import React from 'react'





// Local imports
import { DebugPanel } from '.'
import { FPSMeter } from '..'





class StatsDebugPanel extends React.Component {
  render () {
    return (
      <DebugPanel title="Stats">
        <FPSMeter />
      </DebugPanel>
    )
  }
}





export { StatsDebugPanel }
