import * as web3 from '@solana/web3.js'

export async function initializeKeypair(connection: web3.Connection): Promise<web3.Keypair> {
  if (!process.env.REACT_APP_PRIVATE_KEY) {
    console.log('Creating .env file')
    const signer = web3.Keypair.generate()
    // fs.writeFileSync('.env', `REACT_APP_PRIVATE_KEY=[${signer.secretKey.toString()}]`)
    console.log(`REACT_APP_PRIVATE_KEY=[${signer.secretKey.toString()}]`);
    await airdropSolIfNeeded(signer, connection)

    return signer
  }

  const secret = JSON.parse(process.env.REACT_APP_PRIVATE_KEY ?? "") as number[]
  const secretKey = Uint8Array.from(secret)
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
  await airdropSolIfNeeded(keypairFromSecretKey, connection)
  return keypairFromSecretKey
}

async function airdropSolIfNeeded(signer: web3.Keypair, connection: web3.Connection) {
  const balance = await connection.getBalance(signer.publicKey)
  console.log('Current balance is', balance)
  if (balance < web3.LAMPORTS_PER_SOL) {
    console.log('Airdropping 1 SOL...')
    await connection.requestAirdrop(signer.publicKey, web3.LAMPORTS_PER_SOL)
  }
}