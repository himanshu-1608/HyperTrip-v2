import React, { Component } from 'react';
import { FaBity } from 'react-icons/fa';
import { connect } from 'react-redux';

import fetcher from '../../fetchWrapper';
import classes from './MovieDetails.module.css';

class MovieDetails extends Component {
  state = {
    movieId: this.props.match.params.movieId,
    movie: this.props.location.data.movie,
    bookedSeats: [],
    bookedSeatNumbers: [],
    selectedSeats: [],
    bookedBy: {},
    isBooked: false,
    hideUserDetails: true,
    clickedSeat: '',
    showMsg: false,
  };

  componentDidMount() {
    this.getMovieDetails();
  }

  getMovieDetails = async () => {
    const movieId = this.state.movieId;
    const result = await fetcher(`/movie/booked-seats/${movieId}`, 'GET');
    console.log('getMovieDetails: ', result); // remove later
    if (!result.success) {
      return this.props.history.push('/error');
    }
    const bookedSeatNumbers = result.bookedSeats.map((seat) => seat.number);
    this.setState({
      bookedSeatNumbers: bookedSeatNumbers,
      bookedSeats: result.bookedSeats,
    });
  };

  seatClickHandler = async (event) => {
    const id = event.target.id;
    this.setState({ hideUserDetails: false, clickedSeat: id });
    if (this.props.userInfo && this.props.userInfo.isAdmin) {
      if (event.target.className.includes('Grey')) {
        this.state.bookedSeats.forEach((seat) => {
          if (seat.number === id) {
            this.setState({ bookedBy: { ...seat.bookedBy }, isBooked: true });
          }
        });
      } else {
        this.setState({ isBooked: false });
      }
    } else {
      if (event.target.className.includes('Indigo')) {
        event.target.className = classes.Blue;
        const updatedSelectedSeats = [...this.state.selectedSeats];
        updatedSelectedSeats.push(event.target.id);
        this.setState({ selectedSeats: updatedSelectedSeats }, () =>
          console.log('updated state on seatclickhandler', this.state)
        );
      } else if (event.target.className.includes('Blue')) {
        event.target.className = classes.Indigo;
        const updatedSelectedSeats = [...this.state.selectedSeats];
        const index = updatedSelectedSeats.indexOf(event.target.id);
        updatedSelectedSeats.splice(index, 1);
        this.setState({ selectedSeats: updatedSelectedSeats }, () =>
          console.log('updated state on seatclickhandler', this.state)
        );
      }
    }
  };

  buyTicketHandler = async () => {
    if (this.state.selectedSeats.length === 0) return;
    const body = {
      movieId: this.state.movieId,
      selectedSeats: [...this.state.selectedSeats],
    };
    const result = await fetcher(
      '/ticket/book-ticket',
      'POST',
      JSON.stringify(body)
    );
    console.log('buytickethandler result: ', result); // remove later
    if (!result.success) {
      return this.props.history.push('/error');
    }
    this.setState({ showMsg: true });
  };

  resetMovie = async () => {
    const result = await fetcher(
      '/admin/reset?isAdmin=true',
      'POST',
      JSON.stringify({
        movieId: this.state.movieId,
        isAdmin: this.props.userInfo.isAdmin,
      })
    );
    console.log('resetMovie result: ', result); // remove later
    if (!result.success) {
      return this.props.history.push('/error');
    }
  };

  render() {
    const seatsContainer = [];
    let actualSeatNo = 1;
    for (let seatNo = 1; seatNo <= 48; seatNo++) {
      // if seat no. is 3,9,15 etc, if executes and a blank seat will be added
      // actualSeatNo will increment only for real seats not blank seats
      if (seatNo % 3 === 0 && seatNo % 2 !== 0)
        seatsContainer.push(
          <span key={seatNo} className={classes.BlankSeat}></span>
        );
      else {
        let divClass = this.state.bookedSeatNumbers.includes(actualSeatNo)
          ? classes.Grey
          : classes.Indigo;
        seatsContainer.push(
          <div
            key={seatNo}
            id={actualSeatNo}
            className={divClass}
            onClick={this.seatClickHandler}>
            {actualSeatNo}
          </div>
        );
        actualSeatNo++;
      }
    }

    return (
      <div className={classes.RootContainer}>
        <div className={classes.BusInfoContainer}>
          <h1>Select Seats</h1>
          <div className={classes.StatusContainer}>
            <div>
              <span className={classes.Indigo} />
              <p>Available</p>
            </div>
            <div>
              <span
                className={classes.Grey}
                style={{ backgroundColor: '#d6d6d6' }}
              />
              <p>Reserved</p>
            </div>

            {!(this.props.userInfo && this.props.userInfo.isAdmin) ? (
              <div>
                <span className={classes.Blue} />
                <p>Selected</p>
              </div>
            ) : null}
          </div>
          <div
            style={{
              backgroundColor: 'black',
              textAlign: 'center',
              color: 'white',
            }}
            className={classes.DriverSymbol}>
            Movie Screen
          </div>
          <div className={classes.SeatsContainer}>{seatsContainer}</div>
          {this.props.userInfo && this.props.userInfo.isAdmin ? (
            <button onClick={this.resetMovie}>Reset</button>
          ) : null}
        </div>
        {this.props.userInfo &&
        this.props.userInfo.isAdmin &&
        !this.state.hideUserDetails ? (
          <div className={classes.PersonDetailsContainer}>
            <p className={classes.SeatNumber}>{this.state.clickedSeat}</p>
            {this.state.isBooked ? (
              <div className={classes.PersonDetails}>
                <p>Booked By</p>
                <hr />
                <div>
                  <p>Name: {this.state.bookedBy.name}</p>
                  <p>E-mail: {this.state.bookedBy.email}</p>
                  <p>Gender: {this.state.bookedBy.gender}</p>
                  <p>Phone no: {this.state.bookedBy.phoneNo}</p>
                </div>
              </div>
            ) : (
              <h2>Not Booked</h2>
            )}
          </div>
        ) : null}
        {!(this.props.userInfo && this.props.userInfo.isAdmin) ? (
          <div className={classes.TicketBookerInfoContainer}>
            <h2>Details</h2>
            <div>
              <p>
                ₹
                {this.state.movie.ticketCharge *
                  this.state.selectedSeats.length}
              </p>
              <p> {this.props.userInfo.name}</p>
              <p>Seats: {this.state.selectedSeats.length} </p>
            </div>
            <button onClick={this.buyTicketHandler}>Buy</button>
            {this.state.showMsg ? (
              <p style={{ marginTop: '15px', color: 'green' }}>
                Booked Successfully
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.auth.userDetails,
  };
};

export default connect(mapStateToProps)(MovieDetails);
