import React from 'react';
import LandingAppBar from './LandingAppBar';
import { Box } from '@mui/material';
import HostedBookingDivider from './HostedBookingDivider';

function HostedListingView (props) {
  return (
    <>
        <LandingAppBar logout={props.logout} token={props.token} />
        <Box sx={{ m: 5, display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
        <HostedBookingDivider />
    </Box>
    </>
  );
}

export default HostedListingView;
