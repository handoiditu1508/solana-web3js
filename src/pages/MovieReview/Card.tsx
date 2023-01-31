import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Movie from './Movie';

export interface CardProps {
  movie: Movie;
}

export const Card = (props: CardProps) => {
  return (
    <Box sx={{
      p: 4,
      display: { md: "flex" },
      maxWidth: "32rem",
      border: theme => `1px solid ${theme.palette.primary.main}`,
      margin: 2,
    }}>
      <Stack sx={{
        alignItems: { xs: "center", md: "stretch" },
        textAlign: { xs: "center", md: "left" },
        mt: { xs: 4, md: 0 },
        ml: { md: 6 },
        mr: { md: 6 }
      }}>
        <Stack direction="row">
          <Typography sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "large",
            color: theme => theme.palette.grey[200]
          }}>
            {props.movie.title}
          </Typography>
          <br />
          <Typography sx={{
            color: theme => theme.palette.grey[200]
          }}
          >
            {props.movie.rating}/5
          </Typography>
        </Stack>
        <Typography sx={{
          my: 2,
          color: theme => theme.palette.grey[400]
        }}>
          {props.movie.description}
        </Typography>
      </Stack>
    </Box>
  )
}