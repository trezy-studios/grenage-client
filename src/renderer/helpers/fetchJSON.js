const fetchJSON = async (url, options = {}) => {
  return await fetch(url, options).then(response => response.json())
}





export { fetchJSON }
