import { AppProps } from 'next/app'
import Head from 'next/head'

import Provider from '@/modules/redux/Provider'
import { store } from '@/modules/redux/store'

import '../styles/globals.css'
import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import { GittodoroAPIFactoryProvider } from '@/context/GittodoroAPIContextProvider'
import GittodoroContextProvider from '@/context/gittodoro/GittodoroContextProvider'
import Meta from '@/components/Meta'
import { DayPageProvider } from '@/context/gittodoro/DayPageContextProvider'

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
            <DayPageProvider>
              <GittodoroContextProvider>
                <Component {...pageProps} />
              </GittodoroContextProvider>
            </DayPageProvider>
          </GittodoroAPIFactoryProvider>
        </GithubAuthProvider>
      </Provider>
    </>
  )
}

export default MyApp