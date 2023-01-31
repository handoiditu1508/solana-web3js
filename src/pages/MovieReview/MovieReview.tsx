import { AppBar as MuiAppBar, Box, Container, Typography } from "@mui/material"
import { AppBar } from "./AppBar"
import { Form } from "./Form"
import styles from './Home.module.css'
import { MovieList } from "./MovieList"

function MovieReview() {
  return (
    <div className={styles.App}>
      <MuiAppBar>
        <title>Movie Reviews</title>
      </MuiAppBar>
      <AppBar />
      <Container>
        <Box>
          <Typography variant="h1" color="white" ml={4} mt={8}>
            Add a review
          </Typography>
          <Form />
          <Typography variant="h1" color="white" ml={4} mt={8}>
            Existing Reviews
          </Typography>
          <MovieList />
        </Box>
      </Container>
    </div>
  )
}

export default MovieReview