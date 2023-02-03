import { FC, useState } from "react"
import * as Web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { AirdropSchema } from "./AirDrop"
import { kryptMint, ScroogeCoinMint, airdropPDA, airdropProgramId } from "./constants"
import * as token from "@solana/spl-token"
import { Box, Button, FormControl, FormLabel, TextField, Theme } from "@mui/material"

export const Airdrop: FC = () => {
  const [amount, setAmount] = useState(0)

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleKryptSubmit = (event: any) => {
    event.preventDefault()
    const airdrop = new AirdropSchema(amount)
    handleKryptTransactionSubmit(airdrop)
  }

  const handleKryptTransactionSubmit = async (airdrop: AirdropSchema) => {
    if (!publicKey) {
      alert("Please connect your wallet!")
      return
    }
    const transaction = new Web3.Transaction()

    const userATA = await token.getAssociatedTokenAddress(
      kryptMint,
      publicKey
    )
    let account = await connection.getAccountInfo(userATA)

    if (account == null) {
      const createATAIX =
        await token.createAssociatedTokenAccountInstruction(
          publicKey,
          userATA,
          publicKey,
          kryptMint
        )
      transaction.add(createATAIX)
    }

    const buffer = airdrop.serialize()

    const airdropIX = new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: userATA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: kryptMint,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: airdropPDA,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: token.TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: airdropProgramId,
    })

    transaction.add(airdropIX)

    try {
      let txid = await sendTransaction(transaction, connection)
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
    } catch (e) {
      console.log(JSON.stringify(e))
      alert(JSON.stringify(e))
    }
  }

  const handleScroogeSubmit = (event: any) => {
    event.preventDefault()
    const airdrop = new AirdropSchema(amount)
    handleScroogeTransactionSubmit(airdrop)
  }

  const handleScroogeTransactionSubmit = async (airdrop: AirdropSchema) => {
    if (!publicKey) {
      alert("Please connect your wallet!")
      return
    }
    const transaction = new Web3.Transaction()

    const userATA = await token.getAssociatedTokenAddress(
      ScroogeCoinMint,
      publicKey
    )
    let account = await connection.getAccountInfo(userATA)

    if (account == null) {
      const createATAIX =
        await token.createAssociatedTokenAccountInstruction(
          publicKey,
          userATA,
          publicKey,
          ScroogeCoinMint
        )
      transaction.add(createATAIX)
    }

    const buffer = airdrop.serialize()

    const airdropIX = new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: userATA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: ScroogeCoinMint,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: airdropPDA,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: token.TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: airdropProgramId,
    })

    transaction.add(airdropIX)

    try {
      let txid = await sendTransaction(transaction, connection)
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
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
      <form style={{ margin: 2 }} onSubmit={handleKryptSubmit}>
        <TextField
          label="Krypt"
          required
          sx={{ ".MuiFormLabel-root": { color: (theme: Theme) => theme.palette.grey[200] } }}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          inputProps={{
            id: "amount",
            max: 1000,
            min: 1,
            sx: {
              color: (theme: Theme) => theme.palette.grey[400]
            }
          }}
        />
        <Button variant="contained" type="submit" sx={{ mt: 4 }}>
          Airdrop Krypt
        </Button>
      </form>

      <form style={{ margin: 2 }} onSubmit={handleScroogeSubmit}>
        <TextField
          label="Scrooge"
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
        <Button variant="contained" type="submit" sx={{ mt: 4 }}>
          Airdrop Scrooge
        </Button>
      </form>
    </Box>
  )
}