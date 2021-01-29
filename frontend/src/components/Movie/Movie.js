import React from 'react';

import classes from './Movie.module.css';

const movie = (props) => (
  <div className={classes.RootContainer} onClick={props.clicked}>
    <div className={classes.UpperContainer}>
      <div>
        <h3>Cinema</h3>
        <p>{props.movie.cinemaName}</p>
      </div>
      <div>
        <h1>{props.movie.name}</h1>
      </div>
      <div>
        <h2>Seats</h2>
        <p>40</p>
      </div>
    </div>
    <div className={classes.LowerContainer}>
      <div>
        <div>
          <span />
          {props.movie.movieStartTime} <p>start</p>
        </div>
        <div>
          <span />
          {props.movie.movieEndTime} <p> end</p>
        </div>
      </div>

      <div>
        <div className={classes.PriceDiv}>₹{props.movie.ticketCharge}</div>
        <button onClick={props.showBackdropHandler}>
          {props.isAdmin ? 'Details' : 'Book now'}
        </button>
      </div>
    </div>
  </div>
);

export default movie;
