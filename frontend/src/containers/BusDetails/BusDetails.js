
import React, { Component } from 'react';
import { FaBity } from "react-icons/fa";
import { connect } from 'react-redux';

import fetcher from '../../fetchWrapper';
import classes from './BusDetails.module.css';

class BusDetails extends Component {

    state = {
        busId: this.props.match.params.busId,
        bus: this.props.location.data.bus,
        bookedSeats: [],
        bookedSeatNumbers: [],
        selectedSeats: [],
        bookedBy: {},
        isBooked: false,
        hideUserDetails: true,
        clickedSeat: '',
        showMsg: false
    }

    componentDidMount(){
        this.getBusDetails();
    }

    getBusDetails = async() => {
        const busId = this.state.busId;
        const result = await fetcher(`/bus/booked-seats/${busId}`, 'GET');
        console.log(result);                                            // remove later
        if(!result.success){
            return this.props.history.push('/error');
        }
        const bookedSeatNumbers = result.bookedSeats.map(seat => seat.number);
        this.setState({bookedSeatNumbers: bookedSeatNumbers, bookedSeats: result.bookedSeats});
    }

    seatClickHandler = async(event) => {
        const id = event.target.id;
        this.setState({hideUserDetails: false, clickedSeat: id});
        if(this.props.userInfo && this.props.userInfo.isAdmin){
            if(event.target.className.includes('Grey')){
                this.state.bookedSeats.forEach(seat => {
                    if(seat.number === id){
                        this.setState({bookedBy: {...seat.bookedBy}, isBooked: true});
                    }
                });
            }
            else{
                this.setState({isBooked: false});
            }
        }
        else{
            if(event.target.className.includes('Indigo')){
                event.target.className = classes.Blue;
                const updatedSelectedSeats = [...this.state.selectedSeats];
                updatedSelectedSeats.push(event.target.id);
                this.setState({selectedSeats: updatedSelectedSeats}, () => console.log(this.state));
            }
            else if(event.target.className.includes('Blue')){
                event.target.className = classes.Indigo;;
                const updatedSelectedSeats = [...this.state.selectedSeats];
                const index = updatedSelectedSeats.indexOf(event.target.id);
                updatedSelectedSeats.splice(index, 1);
                this.setState({selectedSeats: updatedSelectedSeats}, () => console.log(this.state));
            }
        }
    }

    buyTicketHandler = async() => {
        if(this.state.selectedSeats.length === 0)
            return;
        const body = {
            busId: this.state.busId,
            selectedSeats: [...this.state.selectedSeats]
        };
        const result = await fetcher('/ticket/book-ticket', 'POST', JSON.stringify(body));
        console.log(result);                                        // remove later
        if(!result.success){
           return this.props.history.push('/error');
        }
        // this.props.history.push('/dashboard');
        this.setState({showMsg: true});
    }

    resetBus = async() => {
        const result = await fetcher('/admin/reset', 'POST', JSON.stringify({
            busId: this.state.busId,
            isAdmin: this.props.userInfo.isAdmin
        }));
        console.log(result);                                        // remove later
        if(!result.success){
            return this.props.history.push('/error');
         }
        //  this.props.history.push('/dashboard');
        
    }

    render(){

        const seatsContainer = [];
        let actualSeatNo = 1;
        for(let seatNo=1; seatNo<=48; seatNo++){
            // if seat no. is 3,9,15 etc, if executes and a blank seat will be added
            // actualSeatNo will increment only for real seats not blank seats
            if(seatNo % 3 === 0 && seatNo % 2 !== 0)
                seatsContainer.push(<span key={seatNo} className={classes.BlankSeat}></span>)
            else{
                let divClass = this.state.bookedSeatNumbers.includes(actualSeatNo) ? classes.Grey : classes.Indigo; 
                seatsContainer.push(
                    <div 
                        key={seatNo}
                        id={actualSeatNo}
                        className={divClass}
                        onClick={this.seatClickHandler}>{actualSeatNo}</div>
                );
                actualSeatNo++;
            }
        }

        return(
            <div className={classes.RootContainer}>
                <div className={classes.BusInfoContainer}>
                    <h1>Select Seats</h1>
                    <div className={classes.StatusContainer}>
                        <div>
                            <span className={classes.Indigo} />
                            <p>Available</p>
                        </div>
                        <div>
                            <span className={classes.Grey} style={{backgroundColor: '#d6d6d6'}}/>
                            <p>Reserved</p>
                        </div>

                        {!(this.props.userInfo && this.props.userInfo.isAdmin) ? (
                            <div>
                                <span className={classes.Blue} />
                                <p>Selected</p>
                            </div>
                        ): null}
                        
                    </div>
                    <div className={classes.DriverSymbol}>
                        <div>
                            <FaBity size={45} /> <br/>
                            <span>Driver</span>
                        </div>
                    </div>
                    <div className={classes.SeatsContainer}>
                        {seatsContainer}
                    </div>
                    {(this.props.userInfo && this.props.userInfo.isAdmin) ? (
                        <button onClick={this.resetBus}>
                            Reset        
                        </button>
                    ) : null}
                    
                </div>
                {(this.props.userInfo && this.props.userInfo.isAdmin) && !(this.state.hideUserDetails)? (
                    <div className={classes.PersonDetailsContainer}>
                        <p className={classes.SeatNumber}>{this.state.clickedSeat}</p>
                        {this.state.isBooked ? (
                            <div className={classes.PersonDetails}>
                                <p>Booked By</p>
                                <hr />
                                <div>
                                    <p>Name:  {this.state.bookedBy.name}</p>
                                    <p>E-mail:  {this.state.bookedBy.email}</p>
                                    <p>Gender:  {this.state.bookedBy.gender}</p>
                                    <p>Phone no:  {this.state.bookedBy.phoneNo}</p>
                                </div>
                            </div>
                        ) : (
                            <h2>Not Booked</h2>
                        )}
                        
                    </div>
                ) : null}
                {!(this.props.userInfo && this.props.userInfo.isAdmin) ? (
                    <div className={classes.TicketBookerInfoContainer}>
                        <h2>
                            Details
                        </h2>
                        <div>
                            <p>₹ {300 * this.state.selectedSeats.length}</p>
                            <p> {this.props.userInfo.name}</p>
                            <p>Seats: {this.state.selectedSeats.length}  </p>
                        </div>
                        <button onClick={this.buyTicketHandler}>
                            Buy
                        </button>
                        {this.state.showMsg ? <p
                        style={{marginTop: '15px', color: 'green'}}>Booked Successfully</p> : null}
                    </div>
                ) : null}    
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      userInfo: state.auth.userDetails
    }
  }
  

export default connect(mapStateToProps)(BusDetails);

