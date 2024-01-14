import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LandingAppBar from './LandingAppBar';
import { Box } from '@mui/material';
import ErrorPopUp from './ErrorPopUp';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NumberInput from './NumberInput';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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

const EditListing = (props) => {
  const params = useParams();
  const [step, setStep] = React.useState(1);
  const [files, setFiles] = React.useState([]);
  const [headerTitle, setHeaderTitle] = React.useState('');
  const [error, setError] = React.useState('');
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
  const [numImage, setNumImage] = React.useState(0);
  const [images, setImages] = React.useState([]);
  const [youtube, setYoutube] = React.useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    setError('');
  };

  React.useEffect(() => {
    getTitle();
    setStep(1);
    return () => {
      setHeaderTitle('');
      setError('');
    };
  }, []);

  const getTitle = async () => {
    const response = await fetch(`http://localhost:5005/listings/${params.id}`, {
      method: 'GET',
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setHeaderTitle(data.listing.title);
    }
  };

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

  const metadata = {
    propertyType,
    bathroom,
    bedroom,
    bed,
    amenities,
    images,
    youtube,
  };

  const checkCustomFormat = (input) => {
    const customPattern = /^[\d\s]+[A-Za-z\s,]+,[\s]*[A-Za-z]+,[\s]*[A-Za-z]+,[\s]*\d+,[\s]*[A-Za-z]+$/;
    return customPattern.test(input);
  }

  const editNewListing = async () => {
    const currAddress = address.split(',');
    const newAddress = {
      street: currAddress[0].trim(),
      city: currAddress[1].trim(),
      state: currAddress[2].trim(),
      postcode: currAddress[3].trim(),
      country: currAddress[4].trim(),
    };
    const response = await fetch(`http://localhost:5005/listings/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        address: newAddress,
        thumbnail,
        price: parseInt(price),
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
      setTitle('');
      setAddress('');
      setThumbnail('');
      setPrice(0);
      setPropertyType('');
      setBathroom(0);
      setBedroom(0);
      setBed(0);
      setNumAmenities(0);
      setAmenities([]);
      setNumImage(0);
      setImages([]);
      setFiles([]);
      setStep(1);
      setYoutube('');
      navigate('/dashboard');
    }
  };
  return (
    <>
      <LandingAppBar logout={props.logout} token={props.token} />
      <Box sx={{ m: 5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant='h4' gutterBottom>
          Edit Lisiting: {headerTitle}
        </Typography>
        {step === 1 && (
          <>
            <FormControl sx={{ width: 1 / 3 }} margin='normal'>
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
            <TextField id='outlined-basic' label='Title' name='Title' variant='outlined' margin='normal' sx={{ width: 1 / 3 }} onChange={(e) => setTitle(e.target.value)} value={title} />
            <FormControl sx={{ width: 1 / 3 }} margin='normal'>
              <InputLabel htmlFor='outlined-adornment-amount'>Price/night</InputLabel>
              <OutlinedInput
                id='outlined-adornment-amount'
                name='Amount'
                startAdornment={<InputAdornment position='start'>$</InputAdornment>}
                label='Amount'
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </FormControl>
            <TextField id='outlined-basic' label='Property Type' name='Property Type' variant='outlined' margin='normal' sx={{ width: 1 / 3 }} onChange={(e) => setPropertyType(e.target.value)} value={propertyType} />
            <Button
              component='label'
              variant='contained'
              name='Thumbnail'
              startIcon={<CloudUploadIcon />}
              onChange={(e) => {
                setFiles((prevValue) => {
                  return [...prevValue, e.target.files[0].name];
                });
                fileToDataUrl(e.target.files[0]).then((data) => {
                  setThumbnail(data);
                });
              }}
              sx={{ bgcolor: '#f65f65', color: 'white', m: 1, ml: 0 }}>
              {files[0] === undefined ? 'Upload Thumbnail' : files[0]}
              <VisuallyHiddenInput type='file' name='Thumbnail'/>
            </Button>
            <TextField id='outlined-basic' label='Youtube Link' name='Youtube Link' variant='outlined' margin='normal' sx={{ width: 1 / 3 }} onChange={(e) => setYoutube(e.target.value)} value={youtube} />
          </>
        )}
        {step === 2 && (
          <>
            <Typography sx={{ m: 2 }}>Bathrooms</Typography>
            <NumberInput
              sx={{ mx: 20 }}
              aria-label='Bathrooms'
              name='Bathrooms'
              min={0}
              max={99}
              onBlur={(e) => {
                setBathroom(e.target.value);
              }}
            />

            <Typography sx={{ m: 2 }}>Bedrooms</Typography>
            <NumberInput
              aria-label='Bedrooms'
              name='Bedrooms'
              min={0}
              max={99}
              onBlur={(e) => {
                setBedroom(e.target.value);
              }}
            />

            <Typography sx={{ m: 2 }}>Beds</Typography>
            <NumberInput
              aria-label='Beds'
              name='Beds'
              min={0}
              max={99}
              onBlur={(e) => {
                setBed(e.target.value);
              }}
            />

            <Typography sx={{ m: 2 }}>Amenities</Typography>
            <NumberInput
              aria-label='Amenities'
              name='Amenities'
              min={0}
              max={99}
              onBlur={(e) => {
                setNumAmenities(e.target.value);
              }}
            />

            <Typography sx={{ m: 2 }}>Images</Typography>
            <NumberInput
              aria-label='Images'
              name='Images'
              min={0}
              max={99}
              onBlur={(e) => {
                setNumImage(e.target.value);
              }}
            />
          </>
        )}
        {step === 3 &&
          Array.from({ length: numAmenities }, (_, i) => (
            <TextField
              key={i}
              name={`Amenities ${i + 1}`}
              id='outlined-basic'
              label='Amenities'
              variant='outlined'
              margin='normal'
              sx={{ width: 1 / 3 }}
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
        {step === 3 &&
          Array.from({ length: numImage }, (_, i) => (
            <Button
              key={i}
              name={`Images ${i + 1}`}
              component='label'
              variant='contained'
              startIcon={<CloudUploadIcon />}
              onChange={(e) => {
                setFiles((prevValue) => {
                  return [...prevValue, e.target.files[0].name];
                });
                fileToDataUrl(e.target.files[0]).then((data) => {
                  if (i >= numImage.length) {
                    setImages((prevValue) => {
                      return [...prevValue, data];
                    });
                  } else {
                    setImages((prevValue) => {
                      const newImages = [...prevValue];
                      newImages[i] = data;
                      return newImages;
                    });
                  }
                });
              }}
              sx={{ bgcolor: '#f65f65', color: 'white', m: 1, ml: 0 }}>
              {files[i] === undefined ? 'Upload Image' : files[i]}
              <VisuallyHiddenInput type='file' />
            </Button>
          ))}
      </Box>
      <Box sx={{ display: 'flex', m: 2, justifyContent: 'space-between' }}>
        <Button
          size='large'
          sx={{ color: 'black', mr: 2 }}
          onClick={() => {
            if (step === 4) {
              setAmenities([]);
              setFiles([]);
              setImages([]);
            } else if (step === 1) {
              return;
            }
            setStep(step - 1);
          }}>
          Back
        </Button>
        {step === 3
          ? (
          <Button
            size='large'
            name='Save changes'
            variant='contained'
            sx={{ bgcolor: '#f65f65', color: 'white' }}
            onClick={() => {
              if (amenities.length !== parseInt(numAmenities) || images.length !== parseInt(numImage)) {
                setError('Please fill out all fields');
                return;
              }
              editNewListing();
            }}>
            Save changes
          </Button>
            )
          : (
          <Button
            size='large'
            name='Next'
            variant='contained'
            sx={{ bgcolor: '#f65f65', color: 'white' }}
            onClick={() => {
              switch (step) {
                case 1:
                  if (checkCustomFormat(address) === false) {
                    setError('Address format is incorrect');
                    return;
                  }
                  if (address === '' || title === '' || parseInt(price) === 0 || propertyType === '' || thumbnail === '') {
                    setError('Please fill out all fields');
                    return;
                  } else {
                    setFiles([]);
                  }
                  break;
              }
              setStep(step + 1);
            }}>
            Next
          </Button>
            )}
      </Box>
      {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
    </>
  );
};

export default EditListing;
