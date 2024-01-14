import React from 'react';
import LandingAppBar from './LandingAppBar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import ListingCard from './ListingCard';
import ErrorPopUp from './ErrorPopUp';
import SwipeableTemporaryDrawer from './SwipeableTemporaryDrawer';

const LandingPage = (props) => {
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState({});
  const [change, setChange] = React.useState(0);
  const [filter, setFilter] = React.useState('');

  const handleClose = () => {
    setError('');
  };

  React.useEffect(() => {
    allListing();
    return () => {
      setData({});
      setError('');
    };
  }, [change]);

  const allListing = async () => {
    const response = await fetch('http://localhost:5005/listings', {
      method: 'GET',
    });
    let tempData = await response.json();
    let localData = [];
    if (tempData.error) {
      setError(tempData.error);
    } else {
      tempData = tempData.listings;
      for (const listing of tempData) {
        const response2 = await fetch(`http://localhost:5005/listings/${listing.id}`, {
          method: 'GET',
        });
        const currData = await response2.json();
        if (currData.error) {
          setError(currData.error);
        } else {
          currData.listing.id = listing.id;
          currData.listing.published && localData.push(currData.listing);
        }
      }
      localData.sort((a, b) => (a.title > b.title ? 1 : -1));
      // Not yet sort for status accept or pending
      // Sort by filter
      if (filter !== '') {
        if (filter.title === 'title') {
          localData = localData.filter((item) => item.title.toLowerCase().includes(filter.data));
          console.log(localData);
        } else if (filter.title === 'city') {
          localData = localData.filter((item) => item.address.city.toLowerCase().includes(filter.data));
        } else if (filter.title === 'bedroom') {
          localData = localData.filter((item) => item.metadata.bedroom <= parseInt(filter.data[1]) && item.metadata.bedroom >= parseInt(filter.data[0]));
        } else if (filter.title === 'dateRange') {
          let parts = filter.data.startDate.split('/');
          const startDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
          parts = filter.data.endDate.split('/');
          const endDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
          localData = localData.filter((item) => {
            return (
              item.availability.filter((item) => {
                parts = item.startDate.split('/');
                const itemStartDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                parts = item.endDate.split('/');
                const itemEndDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                return itemStartDate <= startDate && startDate <= itemEndDate && itemStartDate <= endDate && endDate <= itemEndDate;
              }).length > 0
            );
          });
        } else if (filter.title === 'price') {
          localData = localData.filter((item) => item.price <= parseInt(filter.data[1]) && item.price >= parseInt(filter.data[0]));
        } else if (filter.title === 'rating') {
          if (filter.data) {
            localData = localData.sort(
              (a, b) =>
                (b.reviews.length === 0 ? 0 : b.reviews.reduce((a, b) => a + b.rating, 0) / b.reviews.length) -
                (a.reviews.length === 0 ? 0 : a.reviews.reduce((a, b) => a + b.rating, 0) / a.reviews.length),
            );
            console.log(localData);
          } else {
            localData = localData.sort(
              (a, b) =>
                (a.reviews.length === 0 ? 0 : a.reviews.reduce((a, b) => a + b.rating, 0) / a.reviews.length) -
                (b.reviews.length === 0 ? 0 : b.reviews.reduce((a, b) => a + b.rating, 0) / b.reviews.length),
            );
            console.log(localData);
          }

          // TODO: sort by rating
        }
      }
      setData(localData);
    }
  };
  return (
    <>
      <LandingAppBar logout={props.logout} token={props.token} />
      <Box sx={{ m: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4' gutterBottom>
            Welcome to Airbrn!
          </Typography>
          <SwipeableTemporaryDrawer setFilter={setFilter} setError={setError} setChange={setChange} change={change} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {JSON.stringify(data) !== JSON.stringify({}) &&
            data.map((listing, idx) => {
              return <ListingCard key={idx} data={listing} page='publish' name={`Listing Card ${idx + 1}`}/>;
            })}
        </Box>
      </Box>
      {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
    </>
  );
};

export default LandingPage;
