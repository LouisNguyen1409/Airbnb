import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import NumberInput from './NumberInput';
import ErrorPopUp from './ErrorPopUp';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AddListingPopUp = (props) => {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [propertyType, setPropertyType] = React.useState('');
  const [bathroom, setBathroom] = React.useState(0);
  const [bedroom, setBedroom] = React.useState(0);
  const [bed, setBed] = React.useState(0);
  const [numAmenities, setNumAmenities] = React.useState(0);
  const [amenities, setAmenities] = React.useState([]);
  const [error, setError] = React.useState('');
  const [file, setFile] = React.useState('');
  const [youtube, setYouTube] = React.useState('')

  const navigate = useNavigate();
  const handleClickOpen = () => {
    setStep(1);
    setOpen(true);
  };

  const handleClose = () => {
    setTitle('');
    setAddress('');
    setThumbnail('');
    setYouTube('');
    setPrice(0);
    setPropertyType('');
    setBathroom(0);
    setBedroom(0);
    setBed(0);
    setNumAmenities(0);
    setAmenities([]);
    setOpen(false);
  };

  const handleCloseError = () => {
    setError('');
  };

  const metadata = {
    propertyType,
    bathroom,
    bedroom,
    bed,
    amenities,
    youtube
  };

  const checkCustomFormat = (input) => {
    const customPattern = /^[\d\s]+[A-Za-z\s,]+,[\s]*[A-Za-z]+,[\s]*[A-Za-z]+,[\s]*\d+,[\s]*[A-Za-z]+$/;
    return customPattern.test(input);
  }
  const fileToDataUrl = (file) => {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const valid = validFileTypes.find((type) => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
      throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
  };

  const createNewListing = async () => {
    const currAddress = address.split(',');
    const newAddress = {
      street: currAddress[0].trim(),
      city: currAddress[1].trim(),
      state: currAddress[2].trim(),
      postcode: currAddress[3].trim(),
      country: currAddress[4].trim(),
    };
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      body: JSON.stringify({
        title,
        address: newAddress,
        price: parseInt(price),
        thumbnail,
        metadata,
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setOpen(false);
      setTitle('');
      setAddress('');
      setThumbnail('');
      setYouTube('')
      setPrice(0);
      setPropertyType('');
      setBathroom(0);
      setBedroom(0);
      setBed(0);
      setNumAmenities(0);
      setAmenities([]);
      setFile('');
      props.setState(props.state + 1);
      navigate('/dashboard');
    }
  };

  return (
    <>
      <React.Fragment>
        <Button variant='contained' name='Add Listing' sx={{ bgcolor: '#f65f65', color: 'white' }} onClick={handleClickOpen}>
          Create New Airbrb Listing?
        </Button>
        <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
          <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
            Tell us about your place
          </DialogTitle>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            {step === 1 && (
              <>
                <FormControl fullWidth margin='normal'>
                  <InputLabel htmlFor='outlined-adornment-address'>Address</InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-address'
                    startAdornment={<InputAdornment position='start'>📍</InputAdornment>}
                    label='Address'
                    name='Address'
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    placeholder='1 Kensington Street, Kensington, NSW, 2032, Australia'
                  />
                </FormControl>
                <TextField id='outlined-basic' label='Title' name='Title' variant='outlined' margin='normal' fullWidth onChange={(e) => setTitle(e.target.value)} value={title} />
              </>
            )}
            {step === 2 && (
              <>
                <FormControl fullWidth margin='normal'>
                  <InputLabel htmlFor='outlined-adornment-amount'>Price/night</InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-amount'
                    startAdornment={<InputAdornment position='start'>$</InputAdornment>}
                    label='Amount'
                    name='Amount'
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                  />
                </FormControl>
                <TextField id='outlined-basic' label='Property Type' name='Property Type' variant='outlined' margin='normal' fullWidth onChange={(e) => setPropertyType(e.target.value)} value={propertyType} />
                <Button
                  component='label'
                  variant='contained'
                  name='Thumbnail'
                  startIcon={<CloudUploadIcon />}
                  onChange={(e) => {
                    setFile(e.target.files[0].name);
                    fileToDataUrl(e.target.files[0]).then((data) => {
                      setThumbnail(data);
                    });
                  }}
                  sx={{ bgcolor: '#f65f65', color: 'white', m: 1, ml: 0 }}>
                  {file === '' ? 'Upload Thumbnail' : file}
                  <VisuallyHiddenInput type='file' name='Thumbnail' />
                </Button>
                <TextField id='outlined-basic' label='Youtube Link' name='Youtube Link' variant='outlined' margin='normal' fullWidth onChange={(e) => setYouTube(e.target.value)} value={youtube} />
              </>
            )}
            {step === 3 && (
              <>
                <Typography sx={{ m: 2 }}>Bathrooms</Typography>
                <NumberInput
                  sx={{ mx: 20 }}
                  aria-label='Bathrooms'
                  min={0}
                  max={99}
                  name='Bathrooms'
                  onBlur={(e) => {
                    setBathroom(e.target.value);
                  }}
                />

                <Typography sx={{ m: 2 }}>Bedrooms</Typography>
                <NumberInput
                  aria-label='Bedrooms'
                  min={0}
                  max={99}
                  name='Bedrooms'
                  onBlur={(e) => {
                    setBedroom(e.target.value);
                  }}
                />

                <Typography sx={{ m: 2 }}>Beds</Typography>
                <NumberInput
                  aria-label='Beds'
                  min={0}
                  max={99}
                  name='Beds'
                  onBlur={(e) => {
                    setBed(e.target.value);
                  }}
                />

                <Typography sx={{ m: 2 }}>Amenities</Typography>
                <NumberInput
                  aria-label='Amenities'
                  min={0}
                  max={99}
                  name='Amenities'
                  onBlur={(e) => {
                    setNumAmenities(e.target.value);
                  }}
                />
              </>
            )}
            {step === 4 &&
              Array.from({ length: numAmenities }, (_, i) => (
                <TextField
                  key={i}
                  name={`Amenities ${i + 1}`}
                  id='outlined-basic'
                  label='Amenities'
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  onBlur={(e) => {
                    if (i >= amenities.length) {
                      setAmenities((prevValue) => {
                        return [...prevValue, e.target.value];
                      });
                    } else {
                      setAmenities((prevValue) => {
                        const newAmenities = [...prevValue];
                        newAmenities[i] = e.target.value;
                        return newAmenities;
                      });
                    }
                  }}
                />
              ))}
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ color: 'black', mr: 2 }}
              onClick={() => {
                if (step === 4) {
                  setAmenities([]);
                }

                if (step === 1) {
                  return;
                }
                setStep(step - 1);
              }}>
              Back
            </Button>
            {step === 4
              ? (
              <Button
                variant='contained'
                name='Save changes'
                sx={{ bgcolor: '#f65f65', color: 'white' }}
                onClick={() => {
                  if (amenities.length !== parseInt(numAmenities)) {
                    setError('Please fill out all fields');
                    return;
                  }
                  createNewListing();
                }}>
                Save changes
              </Button>
                )
              : (
              <Button
                variant='contained'
                name='Next'
                sx={{ bgcolor: '#f65f65', color: 'white' }}
                onClick={() => {
                  switch (step) {
                    case 1:
                      if (address === '' || title === '') {
                        setError('Please fill out all fields');
                        return;
                      }
                      if (checkCustomFormat(address) === false) {
                        setError('Address format is incorrect');
                        return;
                      }
                      break;
                    case 2:
                      if (parseInt(price) === 0 || thumbnail === '' || propertyType === '') {
                        setError('Please fill out all fields');
                        return;
                      }
                      break;
                  }
                  setStep(step + 1);
                }}>
                Next
              </Button>
                )}
          </DialogActions>
        </BootstrapDialog>
      </React.Fragment>
      {error !== '' && <ErrorPopUp onClick={handleCloseError}>{error}</ErrorPopUp>}
    </>
  );
};

export default AddListingPopUp;
