import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { DialogContent, DialogTitle, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import DateRangePicker from './DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';

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

function ChildModal (props) {
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (props.date === false) {
      handleClose();
      return;
    }
    setOpen(true);
  };

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

  const getPrice = (start, end, price) => {
    const numDays = getDate(start, end);
    return parseInt(price) * numDays;
  }
  const bookingAPI = async () => {
    const response = await fetch(`http://localhost:5005/bookings/new/${params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        dateRange: { startDate: props.startDate, endDate: props.endDate },
        totalPrice: getPrice(props.startDate, props.endDate, props.price),
      }),
    });
    const data = await response.json();
    if (data.error) {
      props.setError(data.error);
    } else {
      props.setChange(props.change + 1);
      props.setSuccess('Booking successfull');
    }
  }
  const handleClose = () => {
    bookingAPI();
    setOpen(false);
    props.setOpenBookingg(false);
    props.setDate(false);
    props.setStartDate(new Date());
    props.setEndDate(new Date());
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen} name='Book'>Book</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 157 }}>
          <Button onClick={handleClose} name='Confirm Booking'>Confirm Booking</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function NestedModal (props) {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [date, setDate] = React.useState(false);

  React.useState(() => {
    setStartDate(new Date(localStorage.getItem('startDate')));
    setEndDate(new Date(localStorage.getItem('endDate')));
    setDate(false);
  });
  const handleClose = () => {
    props.setOpenBooking(false);
    setDate(false);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <div>
      <Modal
        open={props.openBooking}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>

      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        Booking date
      </DialogTitle>

      <IconButton
        aria-label='close'
        onClick={() => {
          props.setOpenBooking(false);
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        {Array.from({ length: 1 }, (_, i) => (
          <LocalizationProvider dateAdapter={AdapterDayjs} key={i}>
            <DateRangePicker
              onChange={(startDate, endDate) => {
                setDate(true);
                setStartDate(startDate);
                setEndDate(endDate);
              }}
            />
            <br />
          </LocalizationProvider>
        ))}
      </DialogContent>
          <ChildModal
          openBooking={props.openBooking}
          setOpenBookingg={props.setOpenBooking}
          startDate={startDate}
          endDate={endDate}
          date={date}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setDate={setDate}
          setError={props.setError}
          price={props.price}
          change={props.change}
          setChange={props.setChange}
          setSuccess={props.setSuccess} />
        </Box>
      </Modal>
    </div>
  );
}
