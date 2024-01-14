import React from 'react';
import ErrorPopUp from './ErrorPopUp';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import LandingAppBar from './LandingAppBar';
import SwipeableTextMobileStepper from './SwipeableTextMobileStepper';
import NestedModal from './BookingModal';
import SuccessPopUp from './SuccessPopUp';
import UserBookingDivider from './UserBookingDivider';

const labels = {
  1: '0',
  2: '0',
  3: '0',
  4: '0',
  5: '0',
};

function UserListingView (props) {
  const params = useParams();
  //   TODO: Address and reviews
  const [error, setError] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [amenities, setAmenities] = React.useState([]);
  const [price, setPrice] = React.useState(0);
  const [images, setImages] = React.useState([]);
  const [propertyType, setPropertyType] = React.useState('');
  const [reviews, setReviews] = React.useState([]);
  const [bedroom, setBedroom] = React.useState(0);
  const [bed, setBed] = React.useState(0);
  const [bathroom, setBathRoom] = React.useState(0);
  const [change, setChange] = React.useState(false);
  const [openBooking, setOpenBooking] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [cntNum, setCntNum] = React.useState(labels);
  const handleClose = () => {
    setError('');
    setSuccess('');
  };

  React.useEffect(() => {
    getData();
    updateCntNum();
    return () => {
      setError('');
      setSuccess('');
    };
  }, []);

  const getData = async () => {
    const response = await fetch(`http://localhost:5005/listings/${params.id}`, {
      method: 'GET',
    });
    const data = await response.json();
    if (data.listing.error) {
      setError(data.error);
    } else {
      setTitle(data.listing.title);
      setAddress(data.listing.address);
      setAmenities(data.listing.metadata.amenities);
      setPrice(data.listing.price);
      const tmpImage = [];
      tmpImage.push(data.listing.thumbnail);
      if (data.listing.metadata.images) {
        for (let i = 0; i < data.listing.metadata.images.length; i++) {
          tmpImage.push(data.listing.metadata.images[i]);
        }
      }
      setImages(tmpImage);
      setPropertyType(data.listing.metadata.propertyType);
      setReviews(data.listing.reviews);
      setBedroom(data.listing.metadata.bedroom);
      setBed(data.listing.metadata.bed);
      setBathRoom(data.listing.metadata.bathroom);
      setChange(!change);
      const tmp = labels;
      for (let i = 1; i < 5; ++i) {
        tmp[i] = 0;
      }
      for (let i = 0; i < data.listing.reviews.length; i++) {
        tmp[data.listing.reviews[i].rating]++
      }
      setCntNum(tmp);
    }
  };

  const getAddress = () => {
    if (address === '') {
      return '';
    }
    const addr = address.street + ', ' + address.city + ', ' + address.state;
    return addr;
  }
  const getAmenities = () => {
    if (amenities.length === 0) {
      return '';
    }
    let s = '';
    for (let i = 0; i < amenities.length; i++) {
      s += amenities[i];
      if (i !== amenities.length - 1) {
        s += '⋅';
      }
    }
    return s;
  }

  const getRooms = () => {
    if (bedroom === 0 && bed === 0 && bathroom === 0) {
      return '';
    }
    let s = '';
    if (bedroom !== 0) {
      s += bedroom + ' bedroom';
    }
    if (bed !== 0) {
      if (s !== '') {
        s += '⋅';
      }
      s += bed + ' bed';
    }
    if (bathroom !== 0) {
      if (s !== '') {
        s += '⋅';
      }
      s += bathroom + ' bathroom';
    }
    return s;
  }

  function parseDate (dateString) {
    const parts = dateString.split('/');
    // Note: months are 0-based in JavaScript Dates, so subtract 1 from the month
    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return formattedDate;
  }

  const getDate = (start, end) => {
    const startDate = parseDate(start);
    const endDate = parseDate(end);

    const timeDifference = endDate - startDate;
    const numDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (isNaN(numDays)) {
      return 0;
    }
    return numDays;
  }

  const getPrice = () => {
    if (localStorage.getItem('dateRange') === 'true') {
      const numDays = getDate(localStorage.getItem('startDate'), localStorage.getItem('endDate'));
      return '$' + price * numDays + ' / ' + ' stay';
    } else {
      return '$' + price + ' / night';
    }
  }
  const updateCntNum = () => {
    // This is for reviewing purpose
    const tmp = labels;
    for (let i = 1; i < 5; ++i) {
      tmp[i] = 0;
    }
    for (let i = 0; i < reviews.length; i++) {
      tmp[reviews[i].rating]++
    }
    setCntNum(tmp);
  }
  return (
    <>
    <LandingAppBar logout={props.logout} token={props.token} />
    <Box sx={{ m: 5, display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Typography variant='h6' sx={{ textDecoration: 'underline', }}>{getAddress()}</Typography>
        <Box sx={{ m: '10px', display: 'flex', justifyContent: 'center', allignItems: 'center', background: '#f4f4f5' }}>
            <SwipeableTextMobileStepper title="Stepping" images={images}></SwipeableTextMobileStepper>
        </Box>
        <Typography variant='h4'>{propertyType}</Typography>
        <Typography variant='h6'>{getAmenities()}</Typography>
        <Typography variant='h6'>{getRooms()}</Typography>
        <Typography variant='h6'>{getPrice()}</Typography>
        <Box sx={{ m: '10px', display: 'flex', justifyContent: 'center', allignItems: 'center' }}>
          <Button variant="contained" name='Book Btn' onClick={() => { setOpenBooking(true); }} sx={{ mr: 2, bgcolor: '#f65f65', display: 'block', color: 'white', width: '200px' }}>Booking</Button>
        </Box>
        <UserBookingDivider reviews={reviews} setReviews={setReviews} cntNum={cntNum} updateCntNum={updateCntNum} />
    </Box>
    {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
    {success !== '' && <SuccessPopUp onClick={handleClose}>{success}</SuccessPopUp>}
    <NestedModal
    openBooking={openBooking}
    setOpenBooking={setOpenBooking}
    change={change}
    setChange={setChange}
    setError={setError}
    price={price}
    setSuccess= {setSuccess}/>
    </>
  );
}

export default UserListingView;
