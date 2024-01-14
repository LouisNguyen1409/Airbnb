import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, DialogTitle, Divider, IconButton, Modal, Rating, TextField, Typography } from '@mui/material';
import ErrorPopUp from './ErrorPopUp';
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';

const Root = styled('div')(({ theme }) => ({
  marginTop: '10px',
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function UserBookingDivider (props) {
  const param = useParams();
  const [error, setError] = React.useState('');
  const [bookings, setBookings] = React.useState([]);
  const [listing, setListing] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [bookingId, setBookingId] = React.useState(0);
  const [owner, setOwner] = React.useState('');
  const [ratingOverall, setRatingOverall] = React.useState(6);
  const [hover, setHover] = React.useState(-1);
  const [currentStar, setCurrentStar] = React.useState(6);

  function getLabelText (value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${props.cntNum[value]}`;
  }

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
      console.log(listing);
    }
  }

  React.useEffect(() => {
    getData();
    return () => {
      setError('');
    };
  }, [currentStar]);

  const handleClose = () => {
    setError('');
    setOpen(false);
  };

  const reviewBooking = async () => {
    console.log('cc');
    setOpen(true);
  }
  const postReview = async (bookingId, owner) => {
    console.log(bookingId, owner, rating, comment);
    const response = await fetch(`http://localhost:5005/listings/${param.id}/review/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        review: {
          bookingId,
          owner,
          rating,
          comment,
        }
      }),
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      window.location.reload();
    }
  }
  return (
    <Root>
        <Typography variant='h4'>Leave a Review</Typography>
        {bookings.slice().reverse().map((booking, idx) => {
          if (booking.listingId === param.id &&
          booking.status === 'accepted' &&
          booking.owner === localStorage.getItem('userEmail')) {
            for (let i = 0; i < props.reviews.length; i++) {
              if (props.reviews[i].bookingId === booking.id) {
                return <React.Fragment key={`empty-${booking.id}`} />;
              }
            }
            return <Box key={booking.id} sx={{ m: '10px', background: '#f4f4f5', padding: '10px' }}>
            <Typography variant='h6' sx={{ m: '10px' }}>ID: {booking.id}</Typography>
            <Typography variant='h6' sx={{ m: '10px' }}>Period: {booking.dateRange.startDate} - {booking.dateRange.endDate}</Typography>
            <Typography variant='h6' sx={{ m: '10px' }}>Total Price: {booking.totalPrice}</Typography>
            <Button
                variant="contained"
                color="success"
                name='Review'
                sx={{ ml: '10px', mb: '5px' }}
                onClick={(event) => { reviewBooking(); setBookingId(booking.id); setOwner(booking.owner); }}
            >
            Review
            </Button>
        </Box>
          } else {
            return <React.Fragment key={`empty-${booking.id}`} />;
          }
        })}

        <Typography variant='h4' sx={{ display: 'inline-block', mr: '10px' }}>Reviews</Typography>
        <Rating
          name="hover-feedback"
          value={ratingOverall}
          precision={1}
          getLabelText={getLabelText}
          onChange={(event, newValue) => {
            setRatingOverall(newValue);
            props.updateCntNum();
            setCurrentStar(newValue);
          }}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {ratingOverall !== null && (
          <Box sx={{ ml: 2, display: 'inline-block' }}><h3>{props.cntNum[hover !== -1 ? hover : ratingOverall]}</h3></Box>
        )}
        {props.reviews.map((review, idx) => {
          if (review.rating === currentStar || currentStar === 6) {
            return <Box key={idx}>
            <Divider />
              <Typography sx={{ mt: 2 }} variant='h5'>👨‍💻 : {review.owner}</Typography>
              <Rating name="read-only" value={review.rating} readOnly />
              <Typography sx={{ mb: 5 }} variant='h5'>💭 : {review.comment}</Typography>
          </Box>
          } else {
            return <React.Fragment key={`empty-${idx}`} />;
          }
        })}
        {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
        {open !== false && <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>

      <DialogTitle id='customized-dialog-title'>
        Review Form
      </DialogTitle>

      <IconButton
        aria-label='close'
        onClick={() => {
          setOpen(false);
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>
      <Rating
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        />
      <TextField id='outlined-basic' label='Comment' name='Comment' variant='outlined' margin='normal' fullWidth onChange={(e) => { setComment(e.target.value) }} value={comment} />
      <Button sx={{ mt: '20px' }} variant="contained" name='Review Btn' onClick={() => postReview(bookingId, owner)}>Submit</Button>
        </Box>
      </Modal>
    </div>
        }
    </Root>
  );
}
