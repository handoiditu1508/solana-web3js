import { FC } from 'react'
import styles from './Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <span>Movie Reviews</span>
      <WalletMultiButton />
    </div>
  )
}