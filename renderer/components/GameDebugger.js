// Module imports
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from 'react-tabs'
import { connect } from 'react-redux'
import React from 'react'





// Local imports
import {
  InventoryDebugPanel,
  PlayerDebugPanel,
  SpritesDebugPanel,
  StatsDebugPanel,
  TilesDebugPanel,
  WireframesDebugPanel,
} from './DebugPanels'





// Local constants
const mapStateToProps = ({ debug }) => ({ debug })





@connect(mapStateToProps)
class GameDebugger extends React.Component {
  render () {
    const { debug } = this.props

    if (!debug.enabled) {
      return null
    }

    return (
      <Tabs className="game-debugger">
        <TabList>
          <Tab>Stats</Tab>

          <Tab>Player</Tab>

          <Tab>Inventory</Tab>

          <Tab>Sprites</Tab>

          <Tab>Tiles</Tab>

          <Tab>Wireframes</Tab>
        </TabList>

        <TabPanel>
          <StatsDebugPanel />
        </TabPanel>

        <TabPanel>
          <PlayerDebugPanel />
        </TabPanel>

        <TabPanel>
          <InventoryDebugPanel />
        </TabPanel>

        <TabPanel>
          <SpritesDebugPanel />
        </TabPanel>

        <TabPanel>
          <TilesDebugPanel />
        </TabPanel>

        <TabPanel>
          <WireframesDebugPanel />
        </TabPanel>
      </Tabs>
    )
  }
}





export { GameDebugger }
