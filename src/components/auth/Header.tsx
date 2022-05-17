import Link from 'next/link'

import styles from './Header.module.css'

import MainAuth from './MainAuth'

const Header = () => {
  return (
    <div className={styles.container}>
      <MainAuth />
      <Link href="/"><a className={styles.title}>Gittodoro.</a></Link>
      <span></span>
    </div>
  )
}

export default Header