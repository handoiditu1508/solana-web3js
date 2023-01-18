import * as Web3 from "@solana/web3.js";
import { useState } from "react";

function Balance() {
  const [address, setAddress] = useState<string>("CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN");
  const [balance, setBalance] = useState<number>(0);

  const getBalanceHandler = async () => {
    try {
      const key = new Web3.PublicKey(address);
      const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
      const lamports = await connection.getBalance(key);
      setBalance(lamports / Web3.LAMPORTS_PER_SOL);
    } catch (error) {
      console.error(error);
      setBalance(0);
    }
  }

  const getInfosHandler = async () => {
    try {
      const key = new Web3.PublicKey(address);
      const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
      const infos = await connection.getAccountInfo(key);
      console.log(infos);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <input type="text" placeholder="address" value={address} onChange={e => setAddress(e.target.value)} />
      <button onClick={getBalanceHandler}>Get Balance</button>
      <p>Address: {address}</p>
      <p>Balance: {balance} SOL</p>
      <button onClick={getInfosHandler}>Get Infos</button>
    </>
  )
}

export default Balance
