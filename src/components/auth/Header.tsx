import styles from './Header.module.css'
import MainAuth from './MainAuth'

const Header = () => {
  return (
    <div className={styles.container}>
      <MainAuth />
    </div>
  )
}

export default Header