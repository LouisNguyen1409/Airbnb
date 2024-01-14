import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';

import { ThemeProvider } from '@mui/material/styles';
import { airbnbTheme } from '../theme/airbnbColor';
import { useNavigate } from 'react-router-dom';

// const settings = ['Profile', 'Account', 'Dashboard'];
const pages = ['Test', 'Switch to hosting', 'All listings', 'Logout'];

const LandingAppBar = (props) => {
  const [auth, setAuth] = React.useState(false);
  // const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    const checktoken = localStorage.getItem('token');
    if (checktoken !== null) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [props.token]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // const handleMenu = (event) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  const handleCloseNavMenu = (page) => () => {
    switch (page) {
      case 'Switch to hosting':
        navigate('/dashboard');
        break;
      case 'All listings':
        navigate('/');
        break;
      case 'Logout':
        props.logout();
        break;
      case 'Test':
        navigate('/user/listing/');
        break;
    }
    setAnchorElNav(null);
  };

  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };
  return (
    <ThemeProvider theme={airbnbTheme}>
      <AppBar position='static' sx={{ bgcolor: 'ochre.light' }}>
        <Container maxWidth='xl'>
          <Toolbar>
            <Typography
              data-testid={'airbrb-landing-app-bar'}
              variant='h6'
              noWrap
              component='a'
              href='#app-bar-with-responsive-menu'
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '0.1rem',
                color: '#f65f65',
                textDecoration: 'none',
              }}>
              Airbrb
            </Typography>

            {auth && (
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton size='large' aria-label='account of current user' aria-controls='menu-appbar' aria-haspopup='true' onClick={handleOpenNavMenu} color='#f65f65'>
                  <MenuIcon />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu()}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}>
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu(page)}>
                      <Typography textAlign='center'>{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
            <Typography
              variant='h5'
              noWrap
              component='a'
              href='#app-bar-with-responsive-menu'
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '0.1rem',
                color: '#f65f65',
                textDecoration: 'none',
              }}>
              Airbrb
            </Typography>
            {auth && (
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'flex-end' } }}>
                {pages.map((page) => (
                  // TODO: Delete the Test later. It is a button for working on any page.
                  <Button variant="contained" key={page} name={page} onClick={handleCloseNavMenu(page)} sx={{ mr: 2, bgcolor: '#f65f65', display: 'block', color: page !== 'Test' ? 'white' : 'black' }}>
                    {page}
                  </Button>
                ))}
              </Box>
            )}
            {auth && (
              <div>
                <Tooltip title='Open settings'>
                  <IconButton /* onClick={handleMenu} */ sx={{ p: 0 }}>
                    <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
                  </IconButton>
                </Tooltip>

                {/* <Menu
                  sx={{ mt: '45px' }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}>
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign='center'>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu> */}
              </div>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default LandingAppBar;
