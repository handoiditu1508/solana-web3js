import { FC, useState } from "react"
import * as Web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { kryptMint, ScroogeCoinMint, tokenSwapStateAccount, swapAuthority, poolKryptAccount, poolScroogeAccount, poolMint, feeAccount } from "./constants"
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap"
import * as token from "@solana/spl-token"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Box, Button, FormControl, FormLabel, TextField, Theme } from "@mui/material"

export const WithdrawSingleTokenType: FC = (props: {
  onInputChange?: (val: number) => void
  onMintChange?: (account: string) => void
}) => {
  const [poolTokenAmount, setAmount] = useState(0)
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleWithdrawSubmit = (event: any) => {
    event.preventDefault()
    handleTransactionSubmit()
  }

  const handleTransactionSubmit = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!")
      return
    }
  }

  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      margin={2}
      justifyContent="center"
    >
      <form onSubmit={handleWithdrawSubmit}>
        <TextField
          label="LP-Token Withdrawal Amount"
          required
          sx={{ ".MuiFormLabel-root": { color: (theme: Theme) => theme.palette.grey[200] } }}
          value={poolTokenAmount}
          onChange={(e) => setAmount(~~(Number(e.target.value)))}
          inputProps={{
            id: "amount",
            sx: {
              max: 1000,
              min: 1,
              fontSize: 20,
              color: (theme: Theme) => theme.palette.grey[400]
            }
          }}
          placeholder="0.00"
        />
        <Button variant="contained" type="submit" sx={{ mt: 4 }}>
          Withdraw
        </Button>
      </form>
    </Box>
  )
}