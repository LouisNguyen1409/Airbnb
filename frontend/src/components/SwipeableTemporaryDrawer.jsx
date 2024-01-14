import React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CustomizedSlider from './Slider';
import DateRangePicker from './DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import UseRadioGroup from './RadioCheckBox';

const SwipeableTemporaryDrawer = (props) => {
  const [state, setState] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [city, setCity] = React.useState('');
  const [bedroom, setBedroom] = React.useState('');
  const [dateRange, setDateRange] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [rating, setRating] = React.useState(''); // High -> Low: true, Low -> High: false
  const [isFilter, setIsFilter] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('');

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    if (open) {
      setTitle('');
      setCity('');
      setBedroom('');
      setDateRange('');
      setPrice('');
      setRating('');
      localStorage.setItem('dateRange', false);
    }
    setState(open);
  };

  const checkFilter = () => {
    const data = [
      { title: 'title', data: title },
      { title: 'city', data: city },
      { title: 'bedroom', data: bedroom },
      { title: 'dateRange', data: dateRange },
      { title: 'price', data: price },
      { title: 'rating', data: rating },
    ];
    const check = data.filter((item) => item.data !== '');
    console.log(check);
    if (check.length === 1) {
      setSortBy(check[0].title);
      return check[0];
    }
    return '';
  };

  const sort = () => (
    <Box sx={{ width: 250, p: 2 }} role='presentation'>
      <TextField id='outlined-basic' label='Title' variant='outlined' margin='normal' fullWidth onChange={(e) => setTitle(e.target.value)} value={title} />
      <TextField id='outlined-basic' label='City Location' variant='outlined' margin='normal' fullWidth onChange={(e) => setCity(e.target.value)} value={city} />
      <Divider />
      <CustomizedSlider onChange={setBedroom} max={30}>
        Number of bedrooms
      </CustomizedSlider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          onChange={(startDate, endDate) => {
            localStorage.setItem('startDate', startDate);
            localStorage.setItem('endDate', endDate);
            localStorage.setItem('dateRange', true);
            setDateRange({ startDate, endDate });
          }}
        />
      </LocalizationProvider>
      <CustomizedSlider onChange={setPrice} max={9999}>
        Price
      </CustomizedSlider>
      <Typography>Rating</Typography>
      <UseRadioGroup onClick={setRating}/>
      {/* <Button variant='contained' sx={{ m: 1, bgcolor: '#f65f65', color: 'white' }} size='small' onClick={() => setRating(true)}>
        Highest to Lowest
      </Button>
      <Button variant='contained' sx={{ m: 1, bgcolor: '#f65f65', color: 'white' }} size='small' onClick={() => setRating(false)}>
        Lowest to Highest
      </Button> */}
    </Box>
  );

  const search = () => {
    if (checkFilter() !== '') {
      props.setFilter(checkFilter());
      setIsFilter(true);
      props.setChange(props.change + 1);
    } else {
      props.setFilter('');
      props.setError('Please select only one filter');
      setIsFilter(false);
    }
  };

  return (
    <>
      <div>
        <React.Fragment>
          <Button onClick={toggleDrawer(true)} sx={{ color: '#f65f65' }}>
            <FilterAltIcon />
            {sortBy === '' ? 'Search with Filter' : `Filter by ${sortBy}`}
          </Button>
          <SwipeableDrawer anchor={'right'} open={state} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} sx={{ display: 'flex', flexDirection: 'row' }}>
            {sort()}
            <Button
              sx={{ alignSelf: 'flex-end', bgcolor: '#f65f65', color: 'white', m: 1 }}
              onClick={() => {
                toggleDrawer(false)();
                search();
              }}
              variant='contained'>
              Search
            </Button>
            {isFilter && (
              <Button
                sx={{ alignSelf: 'flex-end', bgcolor: '#f65f65', color: 'white', m: 1 }}
                onClick={() => {
                  props.setFilter('');
                  props.setChange(props.change + 1);
                  setIsFilter(false);
                  toggleDrawer(false)();
                  setSortBy('');
                }}
                variant='contained'>
                Clear Filter
              </Button>
            )}
            <Button sx={{ alignSelf: 'flex-end', color: '#f65f65', m: 1 }} onClick={toggleDrawer(false)}>
              Cancel
            </Button>
          </SwipeableDrawer>
        </React.Fragment>
      </div>
    </>
  );
};

export default SwipeableTemporaryDrawer;
