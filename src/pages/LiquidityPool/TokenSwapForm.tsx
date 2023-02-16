import { Box } from "@mui/material"
import { FC } from "react"
import { DepositSingleTokenType } from "./Deposit"
import { SwapToken } from "./Swap"
import { WithdrawSingleTokenType } from "./Withdraw"

export const TokenSwapForm: FC = () => {
  return (
    <Box>
      <DepositSingleTokenType />
      <WithdrawSingleTokenType />
      <SwapToken />
    </Box>
  )
}