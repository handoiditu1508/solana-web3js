import { Button } from "@mui/material";
import * as token from '@solana/spl-token';
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from '@solana/web3.js';
import { initializeKeypair } from "./initializeKeypair";

const TOKEN_MINT_ADDRESS = "7iecmjRXL7aGr9fa4WjBGxwVkRMcT5NrrnADQvmK4VE1";

const createNewMint = async (
  connection: web3.Connection,
  payer: web3.Keypair,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  decimals: number,
): Promise<web3.PublicKey> => {
  const tokenMint = await token.createMint(connection, payer, mintAuthority, freezeAuthority, decimals);
  console.log(`Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`);
  return tokenMint;
}

async function createTokenAccount(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  owner: web3.PublicKey
) {
  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(connection, payer, mint, owner);
  console.log(`Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`);
  return tokenAccount;
}

async function mintTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  destination: web3.PublicKey,
  authority: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.mintTo(connection, payer, mint, destination, authority, amount);
  console.log(`Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);
}

async function approveDelegate(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  delegate: web3.PublicKey,
  owner: web3.Signer | web3.PublicKey,
  amount: number
) {
  const transactionSignature = await token.approve(connection, payer, account, delegate, owner, amount);
  console.log(`Approve Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);
}

async function transferTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.transfer(connection, payer, source, destination, owner, amount);
  console.log(`Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);
}

async function revokeDelegate(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  owner: web3.Signer | web3.PublicKey,
) {
  const transactionSignature = await token.revoke(connection, payer, account, owner);
  console.log(`Revote Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);
}

async function burnTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.burn(connection, payer, account, mint, owner, amount);
  console.log(`Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`);
}

function TokenMint() {
  const { connection } = useConnection();

  const mint = async () => {
    alert("Check the console!");

    // create token mint
    const user = await initializeKeypair(connection);
    const mint = TOKEN_MINT_ADDRESS ? new web3.PublicKey(TOKEN_MINT_ADDRESS) : await createNewMint(connection, user, user.publicKey, user.publicKey, 2);
    const mintInfo = await token.getMint(connection, mint);
    console.log(mintInfo);

    // create token account
    const tokenAccount = await createTokenAccount(connection, user, mint, user.publicKey);

    // mint token
    await mintTokens(connection, user, mint, tokenAccount.address, user, 100 * 10 ** mintInfo.decimals);

    // approve delegate
    const delegate = web3.Keypair.generate();
    await approveDelegate(connection, user, tokenAccount.address, delegate.publicKey, user.publicKey, 50 * 10 ** mintInfo.decimals);

    // transfer tokens
    const receiver = web3.Keypair.generate().publicKey;
    const receiverTokenAccount = await createTokenAccount(connection, user, mint, receiver);
    await transferTokens(connection, user, tokenAccount.address, receiverTokenAccount.address, delegate, 50 * 10 ** mintInfo.decimals);

    // revoke delegate
    await revokeDelegate(connection, user, tokenAccount.address, user.publicKey);

    // burn tokens
    await burnTokens(connection, user, tokenAccount.address, mint, user, 25 * 10 ** mintInfo.decimals);
  }

  return (
    <Button variant="contained" onClick={() => mint()}>Start Mint</Button>
  )
}

export default TokenMint
/**
 * note: to use phantom wallet to sign transaction
 * instead of getting keypair from env
 * we can not use helper functions
 * must create transaction & instruction from scratch
 */

// https://soldev.app/course/token-program