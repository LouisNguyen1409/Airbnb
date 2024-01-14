import React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import { useNavigate } from 'react-router-dom';

const LoginBottom = () => {
  const navigate = useNavigate();
  const pages = ['Register', 'Login'];
  return (
    <Box>
      <BottomNavigation
        showLabels
        value={''}
        onChange={(event, newValue) => {
          navigate(`/${pages[newValue].toLowerCase()}`);
        }}>
        {pages.map((page, idx) => {
          return <BottomNavigationAction key={idx} name={page} label={page} icon={<RestoreIcon />} />;
        })}
      </BottomNavigation>
    </Box>
  );
};

export default LoginBottom;
