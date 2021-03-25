import * as auth from '../auth-provider'
const apiURL = process.env.REACT_APP_API_URL

function client(endpoint, {token, data, headers, ...customConfig} = {}) {
  const config = {
    method: (data) ? 'POST' : 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': (data) ? 'application/json' : undefined,
      ...headers,
    },
    body: (data) ? JSON.stringify(data) : undefined,
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if(response.status === 401){
      await auth.logout()
      window.location.assign(window.location)
      return Promise.reject({message: 'Please re-authenticate'})
    }
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
