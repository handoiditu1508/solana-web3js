import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as web3 from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
// https://solana.stackexchange.com/questions/212/uncaught-referenceerror-buffer-is-not-defined-using-phantom-wallet-solana-and
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

function TransferWallet() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const sendSol = () => {
    if (!publicKey) {
      return;
    }

    const transaction = new web3.Transaction()
    const recipientPubKey = web3.Keypair.generate().publicKey

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: LAMPORTS_PER_SOL * 0.1
    })

    transaction.add(sendSolInstruction);
    sendTransaction(transaction, connection).then(sig => {
      console.log(sig)
    });
  }

  return (
    <>
      <WalletMultiButton />
      {publicKey && <button onClick={() => sendSol()}>Transfer 0.1 SOL</button>}
    </>
  )
}

export default TransferWallet
// https://soldev.app/course/interact-with-wallets