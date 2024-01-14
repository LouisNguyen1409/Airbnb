import Typography from '@mui/material/Typography';
import React from 'react';

const Footer = () => {
  return (
    <Typography
      variant='caption'
      display='block'
      gutterBottom
      sx={{
        textAlign: 'center',
      }}>
      © Airbnb {new Date().getFullYear()}
    </Typography>
  );
}

export default Footer;
