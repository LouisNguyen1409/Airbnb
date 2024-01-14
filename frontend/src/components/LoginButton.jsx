import React from 'react';
import Button from '@mui/material/Button';

const LoginButton = (props) => {
  return (
    <Button sx={{ mt: 1, py: 1.5, bgcolor: '#f65f65', color: 'white' }} fullWidth margin='dense' variant='contained' onClick={props.onClick} {...props}>
      {props.children}
    </Button>
  );
};

export default LoginButton;
