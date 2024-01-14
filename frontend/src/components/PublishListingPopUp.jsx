import React from 'react';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DateRangePicker from './DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { Box } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const PublishListingPopUp = (props) => {
  const [availability, setAvailability] = React.useState(1);
  const [dateAvailable, setDateAvailable] = React.useState([]);
  return (
    <BootstrapDialog
      onClose={() => {
        setAvailability(1);
        props.setOpen(false);
      }}
      aria-labelledby='customized-dialog-title'
      open={props.open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        Available Dates
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={() => {
          setAvailability(1);
          props.setOpen(false);
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
        {Array.from({ length: availability }, (_, i) => (
          <LocalizationProvider dateAdapter={AdapterDayjs} key={i}>
            <DateRangePicker
              onChange={(startDate, endDate) => {
                setDateAvailable((preVal) => {
                  if (preVal[i] === undefined) {
                    return [...preVal, { startDate, endDate }];
                  } else {
                    preVal[i] = { startDate, endDate };
                    return preVal;
                  }
                });
              }}
            />
            <br />
          </LocalizationProvider>
        ))}
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => setAvailability(availability + 1)}>Add availability</Button>
        <Button
          onClick={() => {
            if (availability !== 1) {
              setAvailability(availability - 1);
            }
          }}>
          Remove availability
        </Button>
        <Button
          name='Publish'
          onClick={() => {
            props.setOpen(false);
            setAvailability(1);
            props.publishListing(dateAvailable);
          }}>
          Publish
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default PublishListingPopUp;
