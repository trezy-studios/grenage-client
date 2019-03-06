import SVG from 'react-svg-inline'

const Icon = ({ className, icon, label }) => (
  <SVG
    accessibilityLabel={label}
    className={className}
    // cleanup
    component="i"
    svg={require(`../static/icons/${icon}.svg`)} />
)

export { Icon }
