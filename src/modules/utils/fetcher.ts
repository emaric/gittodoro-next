import HTTPError from '../errors/HTTPError'

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      token,
    }),
    credentials: 'same-origin',
  })

  if (!res.ok) {
    const error = new HTTPError('An error occured while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

export default fetcher
