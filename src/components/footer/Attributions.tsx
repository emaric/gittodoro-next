import styles from './Attributions.module.css'

const Attributions = () => {
  return (
    <div className={styles.container}>
      <Flaticons />
      <Sounds />
    </div>
  )
}

const Flaticons = () => {
  return (
    <>
      <ul>
        <li>
          <a href="https://www.flaticon.com/free-icons/workplace" title="workplace icons">Workplace icons created by Freepik - Flaticon</a>
        </li>
        <li>
          <a href="https://www.flaticon.com/free-icons/coffee-time" title="coffee time icons">Coffee time icons created by Freepik - Flaticon</a>
        </li>
        <li>
          <a href="https://www.flaticon.com/free-icons/sofa" title="sofa icons">Sofa icons created by Freepik - Flaticon</a>
        </li>
        <li>
          <a href="https://www.flaticon.com/free-icons/tomato" title="tomato icons">Tomato icons created by Freepik - Flaticon</a>
        </li>
      </ul>
    </>
  )
}

const Sounds = () => {
  return (
    <>
      <p>“Sounds by <a href="https://quicksounds.com">https://quicksounds.com</a>“</p>
    </>
  )
}

export default Attributions