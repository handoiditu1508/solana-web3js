import { Box, Button, TextField, Theme } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useEffect, useState } from 'react';
import { Card } from './Card';
import Movie from './Movie';
import MovieCoordinator from "./MovieCoordinator";

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // useEffect(() => {
  //   connection.getProgramAccounts(new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)).then(async (accounts) => {
  //     const movies: Movie[] = accounts
  //       .map(({ account }) => {
  //         return Movie.deserialize(account.data);
  //       })
  //       .filter(movie => movie !== null) as Movie[];
  //     setMovies(movies);
  //   });
  // }, []);

  useEffect(() => {
    MovieCoordinator.fetchPage(
      connection,
      page,
      10,
      search,
      !!search
    ).then(setMovies)
  }, [page, search]);

  return (
    <div>
      <TextField
        id="search"
        value={search}
        onChange={event => setSearch(event.currentTarget.value)}
        placeholder='Search'
        inputProps={{ sx: { color: (theme: Theme) => theme.palette.grey[400] } }} />
      {movies.map((movie, i) => {
        return (
          <Card key={i} movie={movie} />
        )
      })}
      <Box>
        {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
        {MovieCoordinator.accounts.length > page * 2 && <Button onClick={() => setPage(page + 1)}>Next</Button>}
      </Box>
    </div>
  )
}