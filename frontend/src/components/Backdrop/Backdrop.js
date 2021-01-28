import React from 'react';

import classes from './Backdrop.module.css';

const backdrop = (props) => (
  <div className={classes.RootContainer} onClick={props.clicked} />
);

export default backdrop;
