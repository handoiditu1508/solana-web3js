import { Box, Button, TextField, Theme } from "@mui/material"
import * as token from "@solana/spl-token"
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import * as Web3 from "@solana/web3.js"
import { FC, useState } from "react"
import { kryptMint, poolKryptAccount, poolMint, poolScroogeAccount, ScroogeCoinMint, swapAuthority, tokenSwapStateAccount } from "./constants"

export const DepositSingleTokenType: FC = (props: {
  onInputChange?: (val: number) => void
  onMintChange?: (account: string) => void
}) => {
  const [poolTokenAmount, setAmount] = useState(0)

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    handleTransactionSubmit()
  }

  const handleTransactionSubmit = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!")
      return;
    }

    // these are the accounts that hold the tokens
    const kryptATA = await token.getAssociatedTokenAddress(kryptMint, publicKey);
    const scroogeATA = await token.getAssociatedTokenAddress(ScroogeCoinMint, publicKey);
    const tokenAccountPool = await token.getAssociatedTokenAddress(poolMint, publicKey);

    // poolMintInfo holds data we've fetched for the pool token mint
    const poolMintInfo = await token.getMint(connection, poolMint);

    const transaction = new Web3.Transaction();

    let account = await connection.getAccountInfo(tokenAccountPool);

    if (account == null) {
      const createATAInstruction = token.createAssociatedTokenAccountInstruction(publicKey, tokenAccountPool, publicKey, poolMint);
      transaction.add(createATAInstruction);
    }

    const instruction = TokenSwap.depositAllTokenTypesInstruction(
      tokenSwapStateAccount,
      swapAuthority,
      publicKey,
      kryptATA,
      scroogeATA,
      poolKryptAccount,
      poolScroogeAccount,
      poolMint,
      tokenAccountPool,
      TOKEN_SWAP_PROGRAM_ID,
      token.TOKEN_PROGRAM_ID,
      poolTokenAmount * 10 ** poolMintInfo.decimals,
      100e9,
      100e9
    );

    transaction.add(instruction)
    try {
      let txid = await sendTransaction(transaction, connection)
      alert(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
      console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
    } catch (e) {
      console.log(JSON.stringify(e))
      alert(JSON.stringify(e))
    }
  }

  return (
    <Box sx={{
      p: 4,
      display: { md: "flex" },
      maxWidth: "32rem",
      margin: 2,
      justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: "0px 10px 5px 7px" }}>
          <TextField
            label="LP-Tokens to receive for deposit to Liquidity Pool"
            required
            sx={{ ".MuiFormLabel-root": { color: (theme: Theme) => theme.palette.grey[200] } }}
            value={poolTokenAmount}
            onChange={(e) => setAmount(~~(Number(e.target.value)))}
            inputProps={{
              id: "amount",
              sx: {
                fontSize: 20,
                color: (theme: Theme) => theme.palette.grey[400]
              }
            }}
            placeholder="0.00"
          />
          <Button variant="contained" type="submit" sx={{ mt: 4 }}>
            Deposit
          </Button>
        </div>
      </form>
    </Box>
  )
}