import Head from 'next/head'
import { NextPage } from 'next/types'

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
        <main>
          {/* <h1 className={styles.title}>git<span>todo</span>ro</h1> */}
          <MainDatePicker />
          <section className={styles.main_clock_container}>
            <MainClock />
          </section>
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

export default Home
