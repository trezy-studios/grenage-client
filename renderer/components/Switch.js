import PropTypes from 'prop-types'
import React from 'react'





const Switch = props => {
  const {
    checked,
    id,
    name,
    onChange,
  } = props

  return (
    <React.Fragment>
      <input
        checked={checked}
        className="switch-control"
        hidden
        id={id}
        name={name}
        onChange={onChange}
        type="checkbox" />

      <label
        className="switch"
        htmlFor={id} />
    </React.Fragment>
  )
}





Switch.defaultProps = {
  checked: false,
  name: '',
}

Switch.propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}





export { Switch }
