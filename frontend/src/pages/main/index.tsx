import React from 'react'
import styles from './index.module.css'

const MainPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to the Main Page</h1>
      <p>This is the main page of the inventory frontend.</p>
    </div>
  )
}

export default MainPage
