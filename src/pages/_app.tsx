import { AppProps } from 'next/app'

import '../styles/globals.css'

import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import GittodoroContextProvider from '@/context/gittodoro/GittodoroContextProvider'
import { GittodoroAPIFactoryProvider } from '@/context/gittodoro-firebase/GittodoroAPIContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GithubAuthProvider>
      <GittodoroAPIFactoryProvider>
        <GittodoroContextProvider>
          <Component {...pageProps} />
        </GittodoroContextProvider>
      </GittodoroAPIFactoryProvider>
    </GithubAuthProvider>
  )
}

export default MyApp