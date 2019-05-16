const isNumberInRange = (number, range) => {
  range.sort((a, b) => {
    if (a > b) {
      return 1
    }

    if (a < b) {
      return -1
    }

    return 0
  })
  return (number >= range[0]) && (number <= range[1])
}





export { isNumberInRange }
