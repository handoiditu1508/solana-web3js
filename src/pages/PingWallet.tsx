import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as Web3 from "@solana/web3.js";

const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

function PingWallet() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const pingHandler = async () => {
    try {
      if (!publicKey) {
        return;
      }
      await connection.requestAirdrop(publicKey, Web3.LAMPORTS_PER_SOL * 1);
      await pingProgram();
    } catch (error) {
      console.error(error);
    }
  }

  const pingProgram = async () => {
    const transaction = new Web3.Transaction();

    const programId = new Web3.PublicKey(PROGRAM_ADDRESS);
    const programDataPubkey = new Web3.PublicKey(PROGRAM_DATA_ADDRESS);

    const instruction = new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: programDataPubkey,
          isSigner: false,
          isWritable: true
        },
      ],
      programId
    });

    transaction.add(instruction)

    const sig = await sendTransaction(transaction, connection);

    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`)
  }
  return (
    <>
      <WalletMultiButton />
      {publicKey && <button onClick={() => pingHandler()}>Ping</button>}
    </>
  )
}

export default PingWallet
// https://soldev.app/course/interact-with-wallets