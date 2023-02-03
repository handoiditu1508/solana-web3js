import { AppBar as MuiAppBar, Box, Container } from "@mui/material";
import styles from '../../styles/Home.module.css';
import { Airdrop } from "./AirdropForm";
import { AppBar } from "./AppBar";
import { TokenSwapForm } from "./TokenSwapForm";

function LiquidityPool() {
  return (
    <div className={styles.App}>
      <MuiAppBar>
        <title>Token Swap</title>
      </MuiAppBar>
      <AppBar />
      <Container>
        <Box>
          <Airdrop />
          <TokenSwapForm />
        </Box>
      </Container>
    </div>
  )
}

export default LiquidityPool;