
import React from 'react';

import classes from './Bus.module.css';

const bus = (props) => {
    return (
        <div className={classes.RootContainer} onClick={props.clicked}>
            <div className={classes.UpperContainer}>
                <div>
                    <h2>Departure Time </h2>
                    <p>{props.bus.departureTime}</p>
                </div>
                <div>
                    <h2>Arrival time</h2>
                    <p>{props.bus.arrivalTime}</p></div>
                <div>
                    <h2>Seat</h2> 
                    <p>40</p>
                </div>
            </div>
            <div className={classes.LowerContainer}>
                <div>
                    <div><span />{props.bus.startCity} <p>start</p></div>
                    <div><span />{props.bus.endCity} <p> end</p></div>
                </div>
                
                <div>    
                    <div className={classes.PriceDiv}>₹ {props.bus.fare}</div>
                    <button onClick={props.showBackdropHandler}>
                        {props.isAdmin ? 'Details' : 'Book now'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default bus;