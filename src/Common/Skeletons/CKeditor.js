import { Box, Skeleton } from '@mui/material';
import React from 'react'

const CKeditor = () => {
  return (
    <Box sx={{padding: 0, margin: 0}}>
      <Skeleton variant="rectangular" animation="wave" width={"100%"} height={40} sx={{marginBottom: "2px"}} />
      <Skeleton variant="rectangular" animation="wave" width={"100%"} height={80} />
    </Box>
  )
}

export default CKeditor