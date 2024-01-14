import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(({ theme, checked }) => ({
  '.MuiFormControlLabel-label': checked && {
    color: theme.palette.primary.main,
  },
}));

const MyFormControlLabel = (props) => {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
};

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};

const UseRadioGroup = (props) => {
  return (
    <RadioGroup
      name='use-radio-group'
      onClick={(e) => {
        if (e.target.value === 'true') {
          props.onClick(true);
        } else {
          props.onClick(false);
        }
      }}>
      <MyFormControlLabel value={'true'} label='Highest to Lowest' control={<Radio />} />
      <MyFormControlLabel value={'false'} label='Lowest to Highest' control={<Radio />} />
    </RadioGroup>
  );
};

export default UseRadioGroup;
