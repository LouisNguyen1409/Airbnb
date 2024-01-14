import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import VideoPlayer from './Youtube';

const ListingCard = (props) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = (event) => {
    event.stopPropagation();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (event) => {
    event.stopPropagation();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const theme = useTheme();
  const data = props.data;
  const informaion = [
    {
      type: data.metadata.propertyType,
      price: data.price,
    },
    {
      bed: data.metadata.bed,
      bathroom: data.metadata.bathroom,
    },
    {
      rating: data.reviews.length === 0 ? 0 : data.reviews.reduce((a, b) => a + b.rating, 0) / data.reviews.length,
      review: data.reviews.length === 0 ? 'No reviews yet' : `${data.reviews.length} Reviews`,
    },
  ];
  return (
    <Card
      sx={{ maxWidth: 345, my: 2, mr: 3 }}
      name={props.name}
      onClick={(event) => {
        event.stopPropagation();
        navigate('/user/listing/' + data.id);
      }}>
      {data.metadata.youtube === '' ? <CardMedia sx={{ height: 200, width: 300 }} image={data.thumbnail} title='thumbnail' /> : <VideoPlayer url={data.metadata.youtube} />}
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {data.title}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ my: 1 }}>
          {activeStep === 0 && (
            <>
              <>Room type: {informaion[activeStep].type}</> <br />
              <>Price per night: {informaion[activeStep].price}</>
            </>
          )}
          {activeStep === 1 && (
            <>
              <>Number of Bed: {informaion[activeStep].bed}</> <br />
              <>Number of Bathroom: {informaion[activeStep].bathroom}</>
            </>
          )}
          {activeStep === 2 && (
            <>
              <Rating name='read-only' value={informaion[activeStep].rating} precision={0.5} readOnly /> <br />
              <>{informaion[activeStep].review}</>
            </>
          )}
        </Typography>
        <MobileStepper
          variant='dots'
          steps={3}
          position='static'
          activeStep={activeStep}
          sx={{ maxWidth: 400, flexGrow: 1 }}
          nextButton={
            <Button size='small' onClick={(event) => handleNext(event)} disabled={activeStep === 2}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </CardContent>
      {props.page !== 'publish' && (
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            name={`${props.name} edit`}
            size='small'
            onClick={(event) => {
              event.stopPropagation();
              props.editListing(data.id);
            }}>
            Edit
          </Button>
          {data.published
            ? (
            <Button
              size='small'
              name={`${props.name} unpublish`}
              onClick={(event) => {
                event.stopPropagation();
                props.unpublishListing(data.id);
              }}>
              Unpublish
            </Button>
              )
            : (
            <Button
              size='small'
              name={`${props.name} publish`}
              onClick={(event) => {
                event.stopPropagation();
                props.publishPopUp(data.id);
              }}>
              Publish
            </Button>
              )}

          <Button
            size='small'
            onClick={(event) => {
              event.stopPropagation();
              props.deleteListing(data.id);
            }}>
            Delete
          </Button>
        </CardActions>
      )}
      {props.page !== 'publish' && (
        <Box sx={{ m: '10px', display: 'flex', justifyContent: 'center', allignItems: 'center' }}>
          <Button
            variant='contained'
            name={`${props.name} viewing`}
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/hosted/listing/${data.id}`);
            }}
            sx={{ mr: 2, bgcolor: '#f65f65', display: 'block', color: 'white', width: '200px' }}>
            Viewing
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default ListingCard;
