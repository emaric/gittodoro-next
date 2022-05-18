import { AppProps } from 'next/app'
import Head from 'next/head'

import Provider from '@/modules/redux/Provider'
import { store } from '@/modules/redux/store'

import '../styles/globals.css'
import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import { GittodoroAPIFactoryProvider } from '@/context/GittodoroAPIContextProvider'
import GittodoroContextProvider from '@/context/gittodoro/GittodoroContextProvider'
import Meta from '@/components/Meta'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Meta />
      <Head>
        <title>Gittodoro.</title>
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