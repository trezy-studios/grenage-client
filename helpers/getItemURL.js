function getItemURL ({ name, quality }) {
  return `/static/items/${name.toLowerCase()}${quality ? `.${quality.toLowerCase()}` : ''}.png`
}

export { getItemURL }
