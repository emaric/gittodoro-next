import { useGithubAuth } from '@/context/GithubAuthContextProvider'
import fetcher from '@/modules/utils/fetcher'
import React from 'react'
import useSWR from 'swr'

const RecordsPage = () => {
  const { user } = useGithubAuth()
  const { data, error } = useSWR(user ? ['/api/records', user.token] : null, fetcher)
  return (
    <div>RecordsPage
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}

export default RecordsPage