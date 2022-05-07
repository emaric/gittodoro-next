import { AppProps } from 'next/app'

import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'

import '../styles/globals.css'
import GittodoroContextProvider from '@/context/gittodoro/GittodoroContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GithubAuthProvider>
      <GittodoroContextProvider>
        <Component {...pageProps} />
      </GittodoroContextProvider>
    </GithubAuthProvider>
  )
}

export default MyApp