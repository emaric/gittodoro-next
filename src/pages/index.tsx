import Head from "next/head"

import MainClock from "@/components/clock/MainClock"
import MainAuth from "@/components/auth/MainAuth"
import MainDatePicker from "@/components/date/MainDatePicker"
import MainAddNewNoteButton from "@/components/notes/MainAddNewNoteButton"
import MainNotes from "@/components/notes/MainNotes"

import styles from '@/styles/Home.module.css'
import { TimeProvider } from "@/context/clock/TimeContextProvider"

const HomePage = () => {
  return (
    <>
      <Head>
        <title>GIT TODO RO</title>
      </Head>

      <div className={styles.container}>
        <header>
        </header>
        <main>
          <div className={styles.main_header}>
            <section className={styles.main_clock_container}>
              <MainClock />
            </section>
            <div className={[styles.top_border, styles.main_nav_container].join(' ')}>
              <div>
                <MainAuth />
              </div>
              <TimeProvider>
                <MainDatePicker sessionsLink='/sessions' />
              </TimeProvider>
              <div>
                <MainAddNewNoteButton />
              </div>
            </div>
          </div>
          <section className={styles.main_notes_container}>
            <MainNotes />
          </section>
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

export default HomePage