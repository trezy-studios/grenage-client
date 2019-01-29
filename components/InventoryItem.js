// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import classnames from 'classnames'
import React from 'react'





// Local imports
import { actions } from '../store'
import getItemURL from '../helpers/getItemURL'





// Local constants
const mapDispatchToProps = dispatch => bindActionCreators({
  moveItems: actions.inventory.moveItems,
}, dispatch)





@connect(null, mapDispatchToProps)
@DragSource('InventoryItem', {
  beginDrag: () => ({}),
  endDrag: (props, monitor) => {
    if (monitor.didDrop()) {
      const destinationInfo = monitor.getDropResult()
      const itemsToMove = [{
        item: props.item,
        destination: destinationInfo.slot,
        source: props.slot,
      }]

      if (destinationInfo.item) {
        itemsToMove.push({
          item: destinationInfo.item,
          destination: props.slot,
          source: destinationInfo.slot,
        })
      }

      props.moveItems(itemsToMove)
    }
  },
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
class InventoryItem extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      connectDragSource,
      isDragging,
      item,
    } = this.props
    const {
      name,
      quality,
      quantity,
    } = item

    return connectDragSource(
      <div
        className={classnames({
          item: true,
          'is-being-dragged': isDragging,
        })}>
        <img src={getItemURL(item)} />

        <span className="name">{name} {quality && `(${quality})`}</span>

        <span className="quantity">x{quantity}</span>
      </div>
    )
  }
}





export { InventoryItem }
