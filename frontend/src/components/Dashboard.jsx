import React from 'react';

// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';
import LandingAppBar from './LandingAppBar';
import { Box } from '@mui/material';
import AddListingPopUp from './AddListingPopUp';
import ErrorPopUp from './ErrorPopUp';
import ListingCard from './ListingCard';
import PublishListingPopUp from './PublishListingPopUp';
import MyChart from './MyChart';
import Button from '@mui/material/Button';
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

const parseJsonFile = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
};

const Dashboard = (props) => {
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState({});
  const [change, setChange] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [currId, setCurrId] = React.useState(0);
  const [json, setJson] = React.useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    setError('');
  };

  React.useEffect(() => {
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token]);

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
    const localData = [];
    if (tempData.error) {
      setError(tempData.error);
    } else {
      tempData = tempData.listings.filter((listing) => listing.owner === localStorage.getItem('userEmail'));
      for (const listing of tempData) {
        const response2 = await fetch(`http://localhost:5005/listings/${listing.id}`, {
          method: 'GET',
        });
        const currData = await response2.json();
        if (currData.error) {
          setError(currData.error);
        } else {
          currData.listing.id = listing.id;
          localData.push(currData.listing);
        }
      }
      setData(localData);
    }
  };

  const editListing = (idx) => {
    navigate(`/edit/${idx}`);
  };

  const publishPopUp = (idx) => {
    setOpen(true);
    setCurrId(idx);
  };

  const publishListing = async (availability) => {
    const response = await fetch(`http://localhost:5005/listings/publish/${currId}`, {
      method: 'PUT',
      body: JSON.stringify({
        availability,
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
      setChange(change + 1);
    }
  };

  const unpublishListing = async (idx) => {
    const response = await fetch(`http://localhost:5005/listings/unpublish/${idx}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setChange(change + 1);
    }
  };

  const deleteListing = async (idx) => {
    const response = await fetch(`http://localhost:5005/listings/${idx}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setChange(change + 1);
      navigate('/dashboard');
    }
  };

  const createNewListing = async (body) => {
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setChange(change + 1);
      navigate('/dashboard');
    }
  };

  return (
    <>
      <LandingAppBar logout={props.logout} token={props.token} />
      <Box sx={{ m: 5 }}>
        <Typography variant='h4' gutterBottom>
          Welcome to Hosted Dashboard!
        </Typography>
        <AddListingPopUp token={props.token} setState={setChange} state={change} />
        <Button
          component='label'
          variant='contained'
          sx={{ bgcolor: '#f65f65', color: 'white', m: 1 }}
          onChange={(e) => {
            setJson(e.target.files[0].name);
            parseJsonFile(e.target.files[0]).then((data) => {
              createNewListing(data);
            });
          }}>
          {json === '' ? 'Create New Airbrb Listing? (via Json)' : `${json} Uploaded!`}
          <VisuallyHiddenInput type='file' />
        </Button>
        <br />
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {JSON.stringify(data) !== JSON.stringify({}) &&
            data.map((listing, idx) => {
              return (
                <ListingCard
                  key={idx}
                  name={`Listing Card ${idx + 1}`}
                  data={listing}
                  editListing={editListing}
                  deleteListing={deleteListing}
                  publishPopUp={publishPopUp}
                  unpublishListing={unpublishListing}
                  onClick={() => {
                    console.log('cc');
                  }}
                />
              );
            })}
        </Box>
      </Box>
      <MyChart setError={setError} />
      {error !== '' && <ErrorPopUp onClick={handleClose}>{error}</ErrorPopUp>}
      <PublishListingPopUp open={open} setOpen={setOpen} publishListing={publishListing} />
    </>
  );
};

export default Dashboard;
