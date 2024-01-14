import * as React from 'react';

import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const ErrorPopUp = (props) => {
  const [state, setState] = React.useState({
    open: true,
    Transition: Slide,
  });

  React.useEffect(() => {
    return () => {
      setState({
        open: true,
        Transition: Slide,
      });
    };
  }, []);

  const handleClose = () => {
    props.onClick();
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <Snackbar open={state.open} onClose={handleClose} TransitionComponent={state.Transition} key={state.Transition.name} autoHideDuration={6000}>
      <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
        {props.children}
      </Alert>
    </Snackbar>
  );
};

export default ErrorPopUp;
