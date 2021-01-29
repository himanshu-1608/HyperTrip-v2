import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { BsSearch, BsCardList } from 'react-icons/bs';
import { BiLogOut, BiUserPlus, BiArrowFromLeft, BiPlus } from 'react-icons/bi';

import Logo from '../../assets/Images/Logo2.jpg';
import classes from './Navbar.module.css';

class Navigation extends Component {
  state = {
    prevPath: '',
  };

  getElements = () => {
    const searchElement = document.getElementById('navSearch');
    const viewElement = document.getElementById('navView');
    const addElement = document.getElementById('navAdd');
    return [searchElement, viewElement, addElement];
  };

  addActiveStyleHandler = () => {
    const [searchElement, viewElement, addElement] = this.getElements();
    const path = this.props.location.pathname;
    this.setState({ prevPath: path });
    if (path.includes('search')) {
      searchElement.style.color = 'white';
      viewElement.style.color = 'black';
      if (addElement) addElement.style.color = 'black';
    } else if (path.includes('add')) {
      searchElement.style.color = 'black';
      viewElement.style.color = 'black';
      addElement.style.color = 'white';
    } else if (!path.includes('dashboard')) {
      searchElement.style.color = 'black';
      viewElement.style.color = 'black';
      if (addElement) addElement.style.color = 'black';
    } else {
      searchElement.style.color = 'black';
      viewElement.style.color = 'white';
      if (addElement) addElement.style.color = 'black';
    }
  };

  componentDidMount() {
    if (this.props.isAuth) this.addActiveStyleHandler();
  }

  componentDidUpdate() {
    const path = this.props.location.pathname;
    if (this.props.isAuth)
      if (this.state.prevPath !== path) {
        this.addActiveStyleHandler();
      }
  }

  render() {
    return (
      <div className={classes.RootContainer}>
        <div className={classes.IconContainer}>
          <img src={Logo} alt="Logo" />
          <span> HyperTrip </span>
        </div>
        <ul>
          {!this.props.isAuth ? (
            <li>
              <BiArrowFromLeft size={25} />
              <NavLink to="/Login" activeStyle={{ color: 'white' }}>
                Login
              </NavLink>
            </li>
          ) : null}

          {!this.props.isAuth ? (
            <li>
              <BiUserPlus size={25} />
              <NavLink to="/signup" activeStyle={{ color: 'white' }}>
                Signup
              </NavLink>
            </li>
          ) : null}

          {this.props.isAuth ? (
            <li>
              <BsSearch style={{ marginRight: '10px' }} />
              <NavLink to="/dashboard/search" id="navSearch">
                Search Bus
              </NavLink>
            </li>
          ) : null}

          {this.props.isAuth ? (
            <li>
              <BsCardList style={{ marginRight: '10px' }} />
              <NavLink to="/dashboard/view-all" id="navView">
                View All
              </NavLink>
            </li>
          ) : null}

          {this.props.isAuth &&
          this.props.userInfo &&
          this.props.userInfo.isAdmin ? (
            <li>
              <BiPlus style={{ marginRight: '10px' }} />
              <NavLink to="/dashboard/add" id="navAdd">
                Add Bus
              </NavLink>
            </li>
          ) : null}

          {this.props.isAuth ? (
            <li>
              <BiLogOut
                size={25}
                style={{
                  marginRight: '10px',
                  position: 'absolute',
                  left: '30px',
                }}
              />
              <div
                className={classes.LogoutDiv}
                onClick={this.props.logoutHandler}>
                Logout
              </div>
            </li>
          ) : null}
        </ul>
      </div>
    );
  }
}

export default withRouter(Navigation);
