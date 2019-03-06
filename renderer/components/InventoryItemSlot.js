// Module imports
import { DropTarget } from 'react-dnd'
import classnames from 'classnames'
import React from 'react'





// Local import
import { InventoryItem } from '.'





@DropTarget('InventoryItem', {
  drop: ({ item, slot }) => ({
    item,
    slot,
  }),
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))
class InventoryItemSlot extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      connectDropTarget,
      isOver,
      item,
      slot,
    } = this.props

    return connectDropTarget(
      <li
        className={classnames({
          slot: true,
          'is-being-dropped-on': isOver,
        })}>
        {item && (
          <InventoryItem
            item={item}
            slot={slot} />
        )}
      </li>
    )
  }
}





export { InventoryItemSlot }
