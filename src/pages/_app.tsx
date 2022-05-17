import { AppProps } from 'next/app'
import Head from 'next/head'

import Provider from '@/modules/redux/Provider'
import { store } from '@/modules/redux/store'

import '../styles/globals.css'
import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import { GittodoroAPIFactoryProvider } from '@/context/GittodoroAPIContextProvider'
import GittodoroContextProvider from '@/context/gittodoro/GittodoroContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GIT TODO RO</title>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#242526" media="(prefers-color-scheme: dark)" />
        <meta name="background-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="background-color" content="#242526" media="(prefers-color-scheme: dark)" />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <Provider store={store}>
        <GithubAuthProvider>
          <GittodoroAPIFactoryProvider>
            <GittodoroContextProvider>
              <Component {...pageProps} />
            </GittodoroContextProvider>
          </GittodoroAPIFactoryProvider>
        </GithubAuthProvider>
      </Provider>
    </>
  )
}

export default MyApp