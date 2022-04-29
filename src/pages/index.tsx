import { ReactNode } from 'react'
import Head from 'next/head'
import { NextPage } from 'next/types'

import { MainClockProvider } from '@/context/MainClockContextProvider'
import { MainSessionsProvider } from '@/context/MainSessionsContextProvider'
import { MainRecordsProvider } from '@/context/MainRecordsContextProvider'
import { MainNotesProvider } from "@/context/MainNotesContextProvider"

import styles from '../styles/Home.module.css'
import MainClock from '@/components/clock/MainClock'
import MainNotes from '@/components/notes/MainNotes'
import MainDatePicker from '@/components/date/MainDatePicker'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gittodoro</title>
      </Head>

      <div className={styles.container}>
        <header>
        </header>
        <main>
          <MainContextProviders>
            <MainDatePicker />
            <section className={styles.main_clock_container}>
              <MainClock />
            </section>
            <section className={styles.main_notes_container}>
              <MainNotes />
            </section>
          </MainContextProviders>
        </main>
        <footer>
          <p>“Sounds by <a href="https://quicksounds.com">https://quicksounds.com</a>“</p>
        </footer>
        <footer>
          <span>Copyright © 2022</span> <a href="https://github.com/emaric/gittodoro.git">@emaric/gittorodo</a>
        </footer>
      </div>
    </>
  )
}

const MainContextProviders = (props: { children: ReactNode }) => {
  return (
    <MainClockProvider>
      <MainSessionsProvider>
        <MainRecordsProvider>
          <MainNotesProvider>
            {props.children}
          </MainNotesProvider>
        </MainRecordsProvider>
      </MainSessionsProvider>
    </MainClockProvider>
  )

}

export default Home
