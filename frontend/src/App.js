import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Navbar from './components/Navbar/Navbar';
import Signup from './containers/Signup/Signup';
import Login from './containers/Login/Login';
import Error from './components/Error/Error';
import MainSection from './containers/MainSection/MainSection';
import MovieDetails from './containers/MovieDetails/MovieDetails';

import * as actionCreators from './actions/index';
import classes from './App.module.css';

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (token && userDetails) {
      this.props.setStatusToLogin(userDetails, token);
      this.props.history.push('/dashboard');
    }
  }

  logoutHandler = () => {
    this.props.setStatusToLogout();
    this.props.history.push('/login');
  };

  render() {
    const isAuth = this.props.isAuth;
    console.log('isAuth changes: ', isAuth);
    return (
      <BrowserRouter>
        <div className={classes.RootContainer}>
          <Navbar
            isAuth={isAuth}
            userInfo={this.props.userInfo}
            logoutHandler={this.logoutHandler}
          />
          <div className={classes.ContentContainer}>
            <Switch>
              {!isAuth ? (
                <Route exact path="/signup" component={Signup} />
              ) : null}
              <Route exact path="/login" component={Login} />
              {isAuth ? (
                <Route path="/dashboard" component={MainSection} />
              ) : null}
              {isAuth ? (
                <Route
                  path="/movie-details/:movieId"
                  component={MovieDetails}
                  isAdmin={this.props.userInfo.isAdmin}
                />
              ) : null}
              <Route exact path="/error" component={Error} />
              <Route path="/" component={MainSection} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth,
    userInfo: state.auth.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStatusToLogin: (userDetails, token) =>
      dispatch(actionCreators.setStatusToLogin(userDetails, token)),
    setStatusToLogout: () => dispatch(actionCreators.setStatusToLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
