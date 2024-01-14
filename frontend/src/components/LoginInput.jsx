import React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginInput = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return props.type !== 'password'
    ? (
    <TextField data-testid={'text-field'} {...props} />
      )
    : (
    <FormControl data-testid="password-form-control" {...props}>
      <InputLabel htmlFor={`outlined-adornment-${props.label}`}>{props.label}</InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${props.label}`}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton aria-label='toggle password visibility' data-testid="visibility-icon" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='end'>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label='Password'
        data-testid={`${props.label.toLowerCase()}-input`}
        name={props.name}
      />
    </FormControl>
      );
};

export default LoginInput;
