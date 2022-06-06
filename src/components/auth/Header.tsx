import Link from 'next/link'

import styles from './Header.module.css'

import MainAuth from './MainAuth'

const Header = () => {
  return (
    <div className={styles.container}>
      <MainAuth />
      <Link href="/"><a className={styles.title}>Git<span className={styles.todo_color}>todo</span>ro.</a></Link>
      <span></span>
    </div>
  )
}

export default Header