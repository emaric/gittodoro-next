import { AppProps } from 'next/app'

import '../styles/globals.css'

import { MainClockProvider } from '@/context/MainClockContextProvider'
import { MainSessionsProvider } from '@/context/MainSessionsContextProvider'
import { MainNotesProvider } from "@/context/MainNotesContextProvider"
import { MainRecordsProvider } from '@/context/MainRecordsContextProvider'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <MainClockProvider>
      <MainSessionsProvider>
        <MainRecordsProvider>
          <MainNotesProvider>
            <Component {...pageProps} />
          </MainNotesProvider>
        </MainRecordsProvider>
      </MainSessionsProvider>
    </MainClockProvider>
  )
}

export default MyApp
