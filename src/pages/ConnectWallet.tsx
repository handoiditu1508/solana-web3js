import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import React, { useEffect, useState } from 'react'

function ConnectWallet() {
  const [balance, setBalance] = useState(0)
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  useEffect(() => {
    if (!connection || !publicKey) { return }

    connection.getAccountInfo(publicKey).then(info => {
      setBalance(info?.lamports ?? 0)
    })
  }, [connection, publicKey]);

  return (
    <>
      <WalletMultiButton />
      <p>{publicKey ? `Balance: ${balance / LAMPORTS_PER_SOL} SOL` : ''}</p>
    </>
  )
}

export default ConnectWallet
// https://soldev.app/course/interact-with-wallets