import Head from "next/head"

import MainClock from "@/components/clock/MainClock"
import MainAuth from "@/components/auth/MainAuth"
import MainDatePicker from "@/components/date/MainDatePicker"
import MainAddNewNoteButton from "@/components/notes/MainAddNewNoteButton"
import MainNotes from "@/components/notes/MainNotes"

import styles from '@/styles/Home.module.css'
import { TimeProvider } from "@/context/clock/TimeContextProvider"
import Attributions from "@/components/footer/Attributions"
import Copyright from "@/components/footer/Copyright"

const HomePage = () => {
  return (
    <>
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
              <div className={styles.date_picker}>
                <TimeProvider>
                  <MainDatePicker sessionsLink='/sessions' />
                </TimeProvider>
              </div>
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
          <div>
            <Copyright />
            <Attributions />
          </div>
        </footer>
      </div>
    </>
  )
}

export default HomePage