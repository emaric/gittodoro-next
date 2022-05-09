import { AppProps } from 'next/app'

import '../styles/globals.css'

import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import { LocalStorageAPIProvider } from '@/context/gittodoro/LocalStorageAPIContextProvider'
import GittodoroContextProvider from '@/context/gittodoro/GittodoroContextProvider'

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