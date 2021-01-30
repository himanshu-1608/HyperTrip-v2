import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BsSearch, BsCardList } from 'react-icons/bs';
import { BiPlus } from 'react-icons/bi';

import Movie from '../../components/Movie/Movie';
import SearchForm from '../SearchForm/SearchForm';
import AddMovieForm from '../AddMovieForm/AddMovieForm';
import classes from './MainSection.module.css';
import fetcher from '../../fetchWrapper';

const getElements = () => {
  const searchElement = document.getElementById('search');
  const viewElement = document.getElementById('view');
  const addElement = document.getElementById('add');
  return [searchElement, viewElement, addElement];
};

class MainSection extends Component {
  state = {
    onSearchSection: true,
    onViewAllSection: false,
    onAddMovieSection: false,
    allMovies: [],
    previousPath: '',
  };

  componentDidMount() {
    this.fetchAllMovies();
    this.renderProperComponent();
  }

  renderProperComponent = () => {
    const path = this.props.location.pathname;
    if (path.includes('search')) this.searchSectionActiveHandler();
    else if (path.includes('add')) this.addMovieSectionActiveHandler();
    else this.viewAllSectionActiveHandler();
    this.setState({ previousPath: path });
  };

  componentDidUpdate() {
    if (this.props.location.data && this.props.location.data.movie) {
      const movie = this.props.location.data.movie;
      this.props.location.data = null;
      const updatedAllMovies = [...this.state.allMovies];
      updatedAllMovies.push(movie);
      this.setState(
        {
          allMovies: updatedAllMovies,
        },
        () => this.viewAllSectionActiveHandler()
      );
    }
    const path = this.props.location.pathname;
    if (this.state.previousPath !== path) {
      this.setState({ previousPath: path });
      this.renderProperComponent();
    }
  }

  fetchAllMovies = async () => {
    let path;
    path =
      this.props.userInfo && this.props.userInfo.isAdmin
        ? '/admin/admin-movies?isAdmin=true'
        : '/movie/movies';
    const result = await fetcher(path, 'GET');
    if (!(result && result.success)) {
      this.props.history.push('/error');
      return;
    }
    this.setState({ allMovies: result.movies });
  };

  searchSectionActiveHandler = () => {
    const [searchElement, viewElement, addElement] = getElements();
    searchElement.className = classes.ActiveDiv;
    viewElement.className = '';
    if (addElement) addElement.className = '';
    this.setState({
      onSearchSection: true,
      onViewAllSection: false,
      onAddMovieSection: false,
    });
    this.props.history.push('/dashboard/search');
  };

  viewAllSectionActiveHandler = () => {
    const [searchElement, viewElement, addElement] = getElements();
    searchElement.className = '';
    viewElement.className = classes.ActiveDiv;
    if (addElement) addElement.className = '';
    this.setState({
      onSearchSection: false,
      onViewAllSection: true,
      onAddMovieSection: false,
    });
    this.props.history.push('/dashboard/view-all');
  };

  addMovieSectionActiveHandler = () => {
    const [searchElement, viewElement, addElement] = getElements();
    searchElement.className = '';
    viewElement.className = '';
    addElement.className = classes.ActiveDiv;
    this.setState({
      onSearchSection: false,
      onViewAllSection: false,
      onAddMovieSection: true,
    });
    this.props.history.push('/dashboard/add');
  };

  redirectToMovieDetails = (movie) => {
    this.props.history.push({
      pathname: '/movie-details/' + movie._id,
      data: { movie: movie },
    });
  };

  render() {
    const searchSection = this.state.onSearchSection ? <SearchForm /> : null;

    let movies;
    movies = this.state.allMovies.map((movie) => {
      return (
        <Movie
          key={movie._id}
          movie={movie}
          clicked={() => this.redirectToMovieDetails(movie)}
          isAdmin={this.props.userInfo.isAdmin}
        />
      );
    });

    const viewAllSection = this.state.onViewAllSection ? movies : null;

    const addMovieSection = this.state.onAddMovieSection ? (
      <AddMovieForm
        isAdmin={this.props.userInfo.isAdmin}
        viewAll={this.viewAllSectionActiveHandler}
      />
    ) : null;

    return (
      <div className={classes.RootContainer}>
        <header>
          <div onClick={this.searchSectionActiveHandler} id="search">
            <BsSearch size={24} />
            <h2>Search</h2>
          </div>
          <div onClick={this.viewAllSectionActiveHandler} id="view">
            <BsCardList size={24} />
            <h2>View All</h2>
          </div>

          {this.props.userInfo && this.props.userInfo.isAdmin ? (
            <div onClick={this.addMovieSectionActiveHandler} id="add">
              <BiPlus size={24} />
              <h2>Add Movie</h2>
            </div>
          ) : null}
        </header>
        <main>
          {searchSection}
          {viewAllSection}
          {addMovieSection}
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth,
    userInfo: state.auth.userDetails,
  };
};

export default connect(mapStateToProps)(MainSection);
