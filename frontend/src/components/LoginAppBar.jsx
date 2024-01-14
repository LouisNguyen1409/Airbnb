import React from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const LoginAppBar = (props) => {
  return (
    <>
      <Typography variant='h6' gutterBottom align='center' sx={{ my: 2, fontWeight: 'medium' }}>
        {props.children}
      </Typography>
      <Divider sx={{ my: 2 }} />
    </>
  );
};

export default LoginAppBar;
