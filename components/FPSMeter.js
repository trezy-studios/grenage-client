class FPSMeter extends React.Component {
  _updateMeter = () => {
    if (this.meterController) {
      this.meterController.tick()
      window.requestAnimationFrame(this._updateMeter)
    }
  }

  componentDidMount () {
    require('fpsmeter')

    this.meterController = new window.FPSMeter(this.meterEl.current, {
      graph: true,
      heat: true,
      history: 200,
      position: 'static',
    })

    this._updateMeter()
  }

  componentWillUnmount () {
    this.meterController.destroy()
  }

  constructor (props) {
    super(props)

    this.meterEl = React.createRef()
  }

  render () {
    return (
      <div ref={this.meterEl} />
    )
  }
}





export { FPSMeter }
