import React from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

import LoginAppBar from './LoginAppBar';
import ErrorPopUp from './ErrorPopUp';
import LoginButton from './LoginButton';
import LoginInput from './LoginInput';

const Register = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.token) {
      navigate('/');
    }
  }, [props.token]);

  const register = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        name,
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
      <LoginAppBar> Sign Up </LoginAppBar>
      <Box sx={{ mx: 5 }}>
        <Typography variant='h5' gutterBottom sx={{ mt: 5 }}>
          Welcome to Airbnb.
        </Typography>
        <LoginInput margin='dense' fullWidth required label='Name' name='Name' type='text' value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <LoginInput margin='dense' fullWidth required label='Email' name='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <LoginInput variant='outlined' margin='dense' fullWidth required label='Password' name='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <LoginInput
          variant='outlined'
          margin='dense'
          fullWidth
          required
          label='Confirm Password'
          name='Confirm Password'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <LoginButton onClick={register} name='Register Account'>
          Register
        </LoginButton>
      </Box>

      {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
    </>
  );
};

export default Register;
