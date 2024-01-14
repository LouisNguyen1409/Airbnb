import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import Footer from './Footer';
import LandingPage from './LandingPage';
import ErrorPopUp from './ErrorPopUp';
import LoginBottom from './LoginBottom';
import EditListing from './EditListing';
import UserListingView from './UserListingView';
import HostedListingView from './HostedListingView';

const PageList = () => {
  const [token, setToken] = React.useState(null);
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  React.useEffect(() => {
    const checktoken = localStorage.getItem('token');
    if (checktoken) {
      setToken(checktoken);
    }
  }, []);

  const handleClose = () => {
    setError('');
  };

  const logout = async () => {
    const response = await fetch('http://localhost:5005/user/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      navigate('/');
    }
  };

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage token={token} setToken={setToken} logout={logout} />} />
        <Route path='/register' element={<Register token={token} setToken={setToken} />} />
        <Route path='/login' element={<Login token={token} setToken={setToken} />} />
        <Route path='/dashboard' element={<Dashboard token={token} setToken={setToken} logout={logout} />} />
        <Route path='/edit/:id' element={<EditListing token={token} setToken={setToken} logout={logout} />} />
        <Route path='/user/listing/:id' element={<UserListingView token={token} setToken={setToken} logout={logout} />} />
        <Route path='/hosted/listing/:id' element={<HostedListingView token={token} setToken={setToken} logout={logout} />} />
      </Routes>
      <br />
      <br />
      <hr />
      {!token && <LoginBottom />}
      {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
      <Footer />
    </>
  );
};

export default PageList;
