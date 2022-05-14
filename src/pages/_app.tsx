import { AppProps } from 'next/app'
import Head from 'next/head'

import '../styles/globals.css'

import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import GittodoroContextProvider from '@/context/gittodoro/GittodoroContextProvider'
import { GittodoroAPIFactoryProvider } from '@/context/gittodoro-firebase/GittodoroAPIContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GIT TODO RO</title>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#242526" media="(prefers-color-scheme: dark)" />
      </Head>
      <GithubAuthProvider>
        <GittodoroAPIFactoryProvider>
          <GittodoroContextProvider>
            <Component {...pageProps} />
          </GittodoroContextProvider>
        </GittodoroAPIFactoryProvider>
      </GithubAuthProvider>
    </>
  )
}

export default MyApp