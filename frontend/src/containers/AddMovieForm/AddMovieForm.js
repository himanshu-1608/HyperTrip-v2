import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { RiMovie2Line } from 'react-icons/ri';
import { BiRupee } from 'react-icons/bi';
import { BsStopwatch } from 'react-icons/bs';
import { MdDateRange, MdTheaters } from 'react-icons/md';

import fetcher from '../../fetchWrapper';
import classes from './AddMovieForm.module.css';

class AddMovieForm extends Component {
  state = {
    movieInfo: {
      name: '',
      cinemaName: '',
      movieDate: '',
      ticketCharge: '',
      movieStartTime: '',
      movieEndTime: '',
    },
    errorMessage: '',
  };

  inputChangeHandler = (event) => {
    const updatedMovieInfo = { ...this.state.movieInfo };
    updatedMovieInfo[event.target.name] = event.target.value;
    this.setState({
      movieInfo: updatedMovieInfo,
    });
  };

  isFormValid = () => {
    const {
      name,
      cinemaName,
      movieDate,
      ticketCharge,
      movieStartTime,
      movieEndTime,
    } = this.state.movieInfo;
    return (
      name.trim().length &&
      cinemaName.trim().length &&
      movieDate.trim().length &&
      ticketCharge &&
      movieStartTime.trim().length &&
      movieEndTime.trim().length
    );
  };

  formSubmitHandler = async () => {
    if (!this.isFormValid()) {
      this.setState({ errorMessage: 'Please enter all the fields.' });
      return;
    }

    const body = { ...this.state.movieInfo, isAdmin: this.props.isAdmin };
    const result = await fetcher(
      '/admin/add-movie?isAdmin=true',
      'POST',
      JSON.stringify(body)
    );
    if (!result.success) {
      this.props.history.push('/error');
    } else {
      return this.props.history.push({
        pathname: '/dashboard/view-all',
        data: {
          movie: result.createdMovie,
        },
      });
    }
  };

  render() {
    return (
      <div className={classes.RootContainer}>
        <div className={classes.InputContainer}>
          <RiMovie2Line size={20} />
          <input
            type="text"
            name="name"
            placeholder="Movie Name"
            value={this.state.movieInfo.name}
            onChange={this.inputChangeHandler}
          />
        </div>
        <div className={classes.InputContainer}>
          <MdTheaters size={20} />
          <input
            type="text"
            name="cinemaName"
            placeholder="Cinema Hall Name"
            value={this.state.movieInfo.cinemaName}
            onChange={this.inputChangeHandler}
          />
        </div>
        <div className={classes.InputContainer}>
          <BiRupee size={20} />
          <input
            type="number"
            name="ticketCharge"
            placeholder="Ticket Price"
            value={this.state.movieInfo.ticketCharge}
            onChange={this.inputChangeHandler}
          />
        </div>
        <div className={classes.InputContainer}>
          <BsStopwatch size={20} />
          <span>Movie Starting Time: </span>
          <input
            type="time"
            name="movieStartTime"
            value={this.state.movieInfo.movieStartTime}
            onChange={this.inputChangeHandler}
            style={{ color: 'grey', outline: 'none' }}
          />
        </div>
        <div className={classes.InputContainer}>
          <BsStopwatch size={20} />
          <span>Movie Ending Time: </span>
          <input
            type="time"
            name="movieEndTime"
            value={this.state.movieInfo.movieEndTime}
            onChange={this.inputChangeHandler}
            style={{ color: 'grey', outline: 'none' }}
          />
        </div>
        <div className={classes.InputContainer}>
          <MdDateRange size={20} />
          <input
            type="date"
            name="movieDate"
            placeholder="Date"
            value={this.state.movieInfo.movieDate}
            onChange={this.inputChangeHandler}
            style={{ color: 'grey', outline: 'none' }}
          />
        </div>
        <button onClick={this.formSubmitHandler}>Add</button>
        {this.state.errorMessage && (
          <div
            style={{
              textAlign: 'center',
              backgroundColor: 'pink',
              marginLeft: '300px',
              padding: '20px',
            }}>
            {this.state.errorMessage}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(AddMovieForm);
