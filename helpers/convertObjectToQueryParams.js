function convertObjectToQueryParams (queryParams) {
  return `?${Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')}`
}

export { convertObjectToQueryParams }
