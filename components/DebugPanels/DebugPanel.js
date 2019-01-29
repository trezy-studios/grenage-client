// Module imports
import ReactDOM from 'react-dom'





class DebugPanel extends React.Component {
  componentDidMount () {
    this.element = document.querySelector('#debug-root')
    this.forceUpdate()
  }

  render () {
    const {
      children,
      title,
    } = this.props

    if (typeof this.element === 'undefined') {
      return null
    }

    return ReactDOM.createPortal((
      <details open>
        <summary>{title}</summary>

        {children}
      </details>
    ), this.element)
  }
}





export { DebugPanel }
