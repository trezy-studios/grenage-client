// Module imports
import classnames from 'classnames'
import fs from 'fs'
import PropTypes from 'prop-types'
import SVG from 'react-svg-inline'
import React from 'react'





const Icon = props => {
  const {
    className,
    icon,
  } = props
  const ImportedSVG = fs.readFileSync(`${__static}/icons/${icon}.svg`, 'utf8')

  return (
    <SVG
      // accessibilityLabel="Amazon Logo"
      className={className || ''}
      // cleanup
      component="i"
      svg={ImportedSVG} />
  )
}

Icon.defaultProps = {}

Icon.propTypes = {}





export { Icon }
