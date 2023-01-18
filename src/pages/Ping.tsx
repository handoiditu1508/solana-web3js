import React from 'react'
import * as Web3 from "@solana/web3.js";

const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

const pingHandler = async () => {
  try {
    const payer = initializeKeypair();
    const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
    await connection.requestAirdrop(payer.publicKey, Web3.LAMPORTS_PER_SOL * 1);
    await pingProgram(connection, payer);
  } catch (error) {
    console.error(error);
  }
}

const pingProgram = async (connection: Web3.Connection, payer: Web3.Keypair) => {
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

  const sig = await Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );

  console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`)
}

const initializeKeypair = () => {
  const secret = JSON.parse(process.env.REACT_APP_PRIVATE_KEY || "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = Web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecretKey;
}

export default function Ping() {
  return (
    <button onClick={pingHandler}>Ping</button>
  )
}
// https://soldev.app/course/intro-to-writing-data