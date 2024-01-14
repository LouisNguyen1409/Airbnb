import React from 'react';
import styled from '@emotion/styled';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/material';

const DateRangePickerStyled = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const DateRangePicker = (props) => {
  const [minDate, setMinDate] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);
  return (
    <DateRangePickerStyled>
      <DatePicker
        label='Start Date'
        onChange={(start) => {
          start !== null && setStartDate(`${start.$D}/${start.$M + 1}/${start.$y}`);
          setMinDate(start);
        }}
        disablePast
        format='DD/MM/YYYY'
        className='start-date'
      />
      <Box sx={{ mx: 2 }}> to </Box>
      <DatePicker
        label='End Date'
        id='end-date'
        onChange={(end) => {
          end !== null && props.onChange(startDate, `${end.$D}/${end.$M + 1}/${end.$y}`);
        }}
        format='DD/MM/YYYY'
        disablePast
        minDate={minDate}
        className='end-date'
      />
    </DateRangePickerStyled>
  );
};

export default DateRangePicker;
