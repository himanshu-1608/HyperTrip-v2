import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MdDateRange, MdTheaters } from 'react-icons/md';

import Movie from '../../components/Movie/Movie';
import fetcher from '../../fetchWrapper';
import classes from './SearchForm.module.css';

class SearchForm extends Component {
  state = {
    name: '',
    movieDate: '',
    searchResults: [],
    errorMessage: '',
    isSearched: false,
  };

  inputChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  formSubmitHandler = async () => {
    const { name, movieDate } = this.state;
    const body = JSON.stringify({
      name: name,
      movieDate: movieDate,
    });
    const result = await fetcher('/movie/search-movie', 'POST', body);
    if (!result.success) {
      this.props.history.push('/error');
    }
    this.setState({ searchResults: result.movies, isSearched: true });
  };

  redirectToMovieDetails = (movie) => {
    this.props.history.push({
      pathname: '/movie-details/' + movie._id,
      data: movie,
    });
  };

  render() {
    let searchResults = null;
    if (this.state.isSearched) {
      const searchedMovies = this.state.searchResults.map((movie) => {
        return (
          <Movie
            key={movie._id}
            movie={movie}
            clicked={() => this.redirectToMovieDetails(movie)}
            isAdmin={this.props.userInfo.isAdmin}
          />
        );
      });

      searchResults = (
        <div className={classes.SearchResultsContainer}>
          <header>
            Search results
            <hr />
          </header>
          <div>{searchedMovies}</div>
        </div>
      );
    }

    return (
      <div className={classes.RootContainer}>
        <div className={classes.FormContainer}>
          <div className={classes.InputContainer}>
            <MdTheaters size={20} />
            <input
              type="text"
              name="name"
              placeholder="Movie Name"
              value={this.state.name}
              onChange={this.inputChangeHandler}
            />
          </div>
          <div className={classes.InputContainer}>
            <MdDateRange size={20} />
            <input
              type="Date"
              name="movieDate"
              placeholder="Date"
              value={this.state.movieDate}
              onChange={this.inputChangeHandler}
              style={{ color: 'grey', outline: 'none' }}
            />
          </div>
          <button onClick={this.formSubmitHandler}>Search</button>
        </div>
        {searchResults}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.auth.userDetails,
  };
};

export default connect(mapStateToProps)(withRouter(SearchForm));
