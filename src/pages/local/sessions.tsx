import Head from "next/head"

import Header from "@/components/auth/Header"
import LocalStorageSessionsManager from "@/components/sessions/LocalStorageSessionsManager"

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
        <main>
          <LocalStorageSessionsManager />
        </main>
      </div>
    </>
  )
}

export default LocalSessionsPage