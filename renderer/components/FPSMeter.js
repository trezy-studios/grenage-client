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
      history: Math.floor((window.innerWidth / 5) / 5),
      position: 'relative',
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
      <div
        className="fps-meter-container"
        ref={this.meterEl} />
    )
  }
}





export { FPSMeter }
