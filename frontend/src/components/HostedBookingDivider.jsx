import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Divider, Typography } from '@mui/material';
import ErrorPopUp from './ErrorPopUp';
import { useParams } from 'react-router-dom';

const Root = styled('div')(({ theme }) => ({
  marginTop: '10px',
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

export default function HostedBookingDivider () {
  const param = useParams();
  const [error, setError] = React.useState('');
  const [bookings, setBookings] = React.useState([]);
  const [listing, setListing] = React.useState({});

  const getData = async () => {
    const response = await fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setBookings(data.bookings);
    }

    const response2 = await fetch(`http://localhost:5005/listings/${param.id}`, {
      method: 'GET',
    });
    const data2 = await response2.json();
    if (data2.error) {
      setError(data2.error);
    } else {
      setListing(data2.listing);
    }
  }

  React.useEffect(() => {
    getData();
    return () => {
      setError('');
    };
  }, []);

  const handleClose = () => {
    setError('');
  };

  const acceptBooking = async (id) => {
    const response = await fetch(`http://localhost:5005/bookings/accept/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      getData();
    }
  }

  const declineBooking = async (id) => {
    const response = await fetch(`http://localhost:5005/bookings/decline/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      getData();
    }
  }

  function parseDate (dateString) {
    const parts = dateString.split('/');
    // Note: months are 0-based in JavaScript Dates, so subtract 1 from the month
    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return formattedDate;
  }

  function formatDate (inputDate) {
    // Assuming inputDate is a valid Date object or a string that can be parsed into a Date
    const date = new Date(inputDate);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Note: Months are zero-based
    const year = date.getFullYear();

    // Assemble the formatted date
    const formattedDate = `${day}/${month}/${year}`;

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

  const getTotalOnlineDate = (idx) => {
    if (listing.postedOn === null) return 'Offline';
    return getDate(formatDate(listing.postedOn), formatDate(Date.now()));
  }

  function isInCurrentYear (dateString) {
    // Parse the date string to create a Date object
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript Date object
    const year = parseInt(parts[2], 10);
    const inputDate = new Date(year, month, day);

    // Get the current date
    const currentDate = new Date();

    // Compare the years
    if (inputDate.getFullYear() < currentDate.getFullYear()) {
      return -1;
    }
    if (inputDate.getFullYear() === currentDate.getFullYear()) {
      return 0;
    }
    return 1;
  }

  const getTotalBookedDay = () => {
    let curr = parseInt(0);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].listingId === param.id && bookings[i].status === 'accepted') {
        if (isInCurrentYear(bookings[i].dateRange.startDate) === 1 ||
        isInCurrentYear(bookings[i].dateRange.endDate) === -1) {
          curr = curr + 0;
        } else {
          if (isInCurrentYear(bookings[i].dateRange.startDate) === 0 && isInCurrentYear(bookings[i].dateRange.endDate) === 0) {
            curr = curr + getDate(bookings[i].dateRange.startDate, bookings[i].dateRange.endDate);
          } else {
            if (isInCurrentYear(bookings[i].dateRange.startDate) === 0 && isInCurrentYear(bookings[i].dateRange.endDate) === 1) {
              curr = curr + getDate(bookings[i].dateRange.startDate, '31/12/' + currentYear);
            } else {
              if (isInCurrentYear(bookings[i].dateRange.endDate) === 0) {
                curr = curr + getDate('01/01/' + currentYear, bookings[i].dateRange.endDate);
              } else {
                curr = curr + 365;
              }
            }
          }
        }
      }
    }
    return curr;
  }
  const getTotalMoneyEarned = () => {
    let curr = 0;
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].listingId === param.id && bookings[i].status === 'accepted') {
        curr = curr + bookings[i].totalPrice;
      }
    }
    return curr;
  }

  return (
    <Root>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>{listing.title}</Typography>
        <Divider></Divider>
        <Typography variant='h6'>Number of days online: {getTotalOnlineDate()}</Typography>
        <Typography variant='h6'>Number of days booked: {getTotalBookedDay()}</Typography>
        <Typography variant='h6'>Money earned: {getTotalMoneyEarned()}</Typography>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Accepted Booking</Typography>
        {bookings.slice().reverse().map((booking, idx) => {
          if (booking.listingId === param.id && booking.status === 'accepted') {
            return <Box key={booking.id} sx={{ m: '10px', background: '#f4f4f5', padding: '10px' }}>
                <Typography variant='h6' sx={{ m: '10px' }}>ID: {booking.id}</Typography>
                <Typography variant='h6' sx={{ m: '10px' }}>Period: {booking.dateRange.startDate} - {booking.dateRange.endDate}</Typography>
                <Typography variant='h6' sx={{ m: '10px' }}>Total Price: {booking.totalPrice}</Typography>
            </Box>
          } else {
            return <React.Fragment key={`empty-${booking.id}`} />;
          }
        })}
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Booking Requests</Typography>
        {bookings.slice().reverse().map((booking) => {
          if (booking.listingId === param.id) {
            return <Box key={booking.id} sx={{ m: '10px', background: '#f4f4f5', padding: '10px' }}>
                <Typography variant='h6' sx={{ m: '10px' }}>ID: {booking.id}</Typography>
                <Typography variant='h6' sx={{ m: '10px' }}>Period: {booking.dateRange.startDate} - {booking.dateRange.endDate}</Typography>
                <Typography variant='h6' sx={{ m: '10px' }}>Total Price: {booking.totalPrice}</Typography>
                <Typography variant='h6' sx={{ m: '10px' }}>Status: {booking.status}</Typography>
                {booking.status === 'pending' &&
                <Box>
                    <Button variant="contained" name='Accept' color="success" sx={{ ml: '10px', mb: '5px' }} onClick={(event) => { acceptBooking(booking.id) }}>Accept</Button>
                    <Button variant="contained" color="error" name='Decline' sx={{ ml: '10px', mb: '5px' }} onClick={(event) => { declineBooking(booking.id) }}>Decline</Button>
                </Box>
                }

            </Box>
          } else {
            return <React.Fragment key={`empty-${booking.id}`} />;
          }
        })}
        {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
    </Root>
  );
}
