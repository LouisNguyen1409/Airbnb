import React from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

import LoginAppBar from './LoginAppBar';
import ErrorPopUp from './ErrorPopUp';
import LoginButton from './LoginButton';
import LoginInput from './LoginInput';

const Login = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  React.useEffect(() => {
    if (props.token) {
      navigate('/');
    }
  }, [props.token]);

  const login = async () => {
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      props.setToken(data.token);
      navigate('/');
    }
  };

  const handleClose = () => {
    setError('');
  };

  return (
    <>
      <LoginAppBar> Log In </LoginAppBar>
      <Box sx={{ mx: 5 }}>
        <Typography variant='h5' gutterBottom sx={{ mt: 5 }}>
          Welcome to Airbnb.
        </Typography>
        <LoginInput margin='dense' fullWidth required label='Email' name='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <LoginInput variant='outlined' margin='dense' fullWidth required name='Password' label='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <LoginButton onClick={login} name='Login Account'>Login</LoginButton>
      </Box>
      {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
    </>
  );
};

export default Login;
