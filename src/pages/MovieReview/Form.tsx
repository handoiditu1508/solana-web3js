import { Box, Button, FormControl, FormLabel, TextField, Theme } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from '@solana/web3.js';
import { FC, useState } from 'react';
import Movie from './Movie';

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const Form: FC = () => {
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const movie = new Movie(title, rating, message)
    handleTransactionSubmit(movie)
  }

  const handleTransactionSubmit = async (movie: Movie) => {
    if (!publicKey) {
      alert('Please connect your wallet!')
      return
    }

    const buffer = movie.serialize();
    const transaction = new web3.Transaction();

    // compute the account where data will be stored
    const [pda] = web3.PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(movie.title)],
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    );

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        }
      ],
      data: buffer,
      programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    });

    transaction.add(instruction);

    try {
      let txid = await sendTransaction(transaction, connection);
      console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
    } catch (e) {
      alert(JSON.stringify(e))
    }
  }

  return (
    <Box sx={{
      p: 4,
      display: { md: "flex" },
      maxWidth: "32rem",
      border: theme => `1px solid ${theme.palette.primary.main}`,
      m: 2,
      justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit}>
        <TextField
          id='title'
          label="Movie Title"
          required
          sx={{ ".MuiFormLabel-root": { color: (theme: Theme) => theme.palette.grey[200] } }}
          inputProps={{ sx: { color: (theme: Theme) => theme.palette.grey[400] } }}
          value={title}
          onChange={event => setTitle(event.currentTarget.value)}
        />
        <TextField
          id='review'
          label="Add your review"
          required
          sx={{ ".MuiFormLabel-root": { color: (theme: Theme) => theme.palette.grey[200] } }}
          multiline
          inputProps={{ sx: { color: (theme: Theme) => theme.palette.grey[400] } }}
          value={message}
          onChange={event => setMessage(event.currentTarget.value)}
        />
        <TextField
          label="Rating"
          required
          sx={{ ".MuiFormLabel-root": { color: (theme: Theme) => theme.palette.grey[200] } }}
          type="number"
          inputProps={{
            max: 5,
            min: 1,
            id: "amount",
            sx: { color: (theme: Theme) => theme.palette.grey[400] }
          }}
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))} />
        <Button
          variant="contained"
          sx={{
            width: "100%",
            mt: 4
          }}
          type="submit">
          Submit Review
        </Button>
      </form>
    </Box>
  );
}