import Head from "next/head"

import Header from "@/components/auth/Header"
import SessionsManagerContainer from "@/components/local-storage-management/SessionsManager"

import styles from '@/styles/local/LocalSessions.module.css'

const LocalSessionsPage = () => {
  return (
    <>
      <Head>
        <title>Manage Local Sessions</title>
      </Head>
      <div>
        <header className={styles.header}>
          <Header />
        </header>
        <main className={styles.main}>
          <SessionsManagerContainer />
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </>
  )
}

export default LocalSessionsPage