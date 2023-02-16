import { FC, useState } from "react"
import * as Web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { kryptMint, ScroogeCoinMint, tokenSwapStateAccount, swapAuthority, poolKryptAccount, poolScroogeAccount, poolMint, feeAccount } from "./constants"
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap"
import * as token from "@solana/spl-token"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Box, Button, FormControl, FormLabel, InputLabel, MenuItem, Select, TextField, Theme } from "@mui/material"

export const SwapToken: FC = () => {
  const [amount, setAmount] = useState(0)
  const [mint, setMint] = useState("")

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleSwapSubmit = (event: any) => {
    event.preventDefault()
    handleTransactionSubmit()
  }

  const handleTransactionSubmit = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!")
      return
    }

    const kryptMintInfo = await token.getMint(connection, kryptMint)
    const ScroogeCoinMintInfo = await token.getMint(connection, ScroogeCoinMint)

    const kryptATA = await token.getAssociatedTokenAddress(kryptMint, publicKey)
    const scroogeATA = await token.getAssociatedTokenAddress(ScroogeCoinMint, publicKey)
    const tokenAccountPool = await token.getAssociatedTokenAddress(poolMint, publicKey)

    const transaction = new Web3.Transaction();

    let account = await connection.getAccountInfo(tokenAccountPool);

    if (account == null) {
      const createATAInstruction = token.createAssociatedTokenAccountInstruction(publicKey, tokenAccountPool, publicKey, poolMint);
      transaction.add(createATAInstruction);
    }

    // check which direction to swap
    if (mint == "option1") {
      const instruction = TokenSwap.swapInstruction(
        tokenSwapStateAccount,
        swapAuthority,
        publicKey,
        kryptATA,
        poolKryptAccount,
        poolScroogeAccount,
        scroogeATA,
        poolMint,
        feeAccount,
        null,
        TOKEN_SWAP_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        amount * 10 ** kryptMintInfo.decimals,
        0
      )

      transaction.add(instruction)
    } else if (mint == "option2") {
      const instruction = TokenSwap.swapInstruction(
        tokenSwapStateAccount,
        swapAuthority,
        publicKey,
        scroogeATA,
        poolScroogeAccount,
        poolKryptAccount,
        kryptATA,
        poolMint,
        feeAccount,
        null,
        TOKEN_SWAP_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        amount * 10 ** ScroogeCoinMintInfo.decimals,
        0
      )

      transaction.add(instruction)
    }

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
      <form onSubmit={handleSwapSubmit}>
        <TextField
          label="Swap Amount"
          required
          sx={{ ".MuiFormLabel-root": { color: (theme: Theme) => theme.palette.grey[200] } }}
          value={amount}
          onChange={(e) => setAmount(~~(Number(e.target.value)))}
          inputProps={{
            id: "amount",
            max: 1000,
            min: 1,
            sx: {
              color: (theme: Theme) => theme.palette.grey[400]
            }
          }}
        />
        <FormControl fullWidth required>
          <InputLabel id="token-to-swap" sx={{ color: (theme: Theme) => theme.palette.grey[200] }}>Token to Swap</InputLabel>
          <Select
            labelId="token-to-swap"
            required
            variant="outlined"
            label="Token to Swap"
            value={mint}
            onChange={e => setMint(e.target.value as string)}
            sx={{
              display: { md: "flex" },
              color: "white",
            }}>
            <MenuItem value="option1" sx={{ color: "#282c34" }}>Krypt</MenuItem>
            <MenuItem value="option2" sx={{ color: "#282c34" }}>Scrooge</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" type="submit" sx={{ mt: 4, display: "block" }}>
          Swap ⇅
        </Button>
      </form>
    </Box>
  )
}