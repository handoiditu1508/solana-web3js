import { FC } from 'react'
import styles from '../../styles/Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <span>Token Swap</span>
      <WalletMultiButton />
    </div>
  )
}