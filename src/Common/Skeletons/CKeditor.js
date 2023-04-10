import { Box, Skeleton } from '@mui/material';
import React from 'react'

const CKeditor = () => {
  return (
    <Box sx={{padding: 0, margin: 0}}>
      <Skeleton variant="rectangular" animation="wave" width={"100%"} height={40} sx={{marginBottom: "2px", borderRadius: "0.4em 0.4em 0 0"}} />
      <Skeleton variant="rectangular" animation="wave" width={"100%"} height={80} sx={{borderRadius: "0 0 0.4em 0.4em"}}/>
    </Box>
  )
}

export default CKeditor