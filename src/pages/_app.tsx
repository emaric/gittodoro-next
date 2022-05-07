import { AppProps } from 'next/app'

import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'

import '../styles/globals.css'
import GittodoroContextProvider from '@/context/gittodoro/GittodoroContextProvider'
import { LocalStorageAPIProvider } from '@/context/gittodoro/LocalStorageAPIContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GithubAuthProvider>
      <LocalStorageAPIProvider>
        <GittodoroContextProvider>
          <Component {...pageProps} />
        </GittodoroContextProvider>
      </LocalStorageAPIProvider>
    </GithubAuthProvider>
  )
}

export default MyApp