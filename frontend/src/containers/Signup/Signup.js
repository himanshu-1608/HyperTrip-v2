import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './Signup.module.css';
import fetcher from '../../fetchWrapper';

class Signup extends Component {
  state = {
    userInfo: {
      name: '',
      email: '',
      phoneNo: '',
      gender: '',
      password: '',
      confirmPassword: '',
      isAdmin: false
    },
    isLoading: false,
    error: ''
  };

  componentDidMount() {
    if (this.props.isAuth) {
      this.props.history.push('/');
    }
  }

  isAnyFieldEmpty = () => {
    const { name, email, password, confirmPassword } = this.state.userInfo;
    return !(
      name.length &&
      email.length &&
      password.length &&
      confirmPassword.length
    );
  };

  isNameValid = () => {
    const { name } = this.state.userInfo;
    if (name.trim().length < 3) {
      return false;
    }
    return true;
  };

  isphoneNoNumberValid = () => {
    const { phoneNo } = this.state.userInfo;
    if (phoneNo.length === 10) {
      return true;
    }
    return false;
  };

  isPasswordValid = () => {
    const { password } = this.state.userInfo;
    if (password.trim().length < 5) {
      return false;
    }
    return true;
  };

  doesPasswordMatches = () => {
    const { password, confirmPassword } = this.state.userInfo;
    if (password === confirmPassword) {
      return true;
    }
    return false;
  };

  isFormValid = () => {
    if (this.isAnyFieldEmpty()) {
      this.setState({ error: 'Please fill all the fields.' });
      return false;
    } else if (!this.isNameValid()) {
      this.setState({ error: 'Name should atleast be 3 characters long.' });
      return false;
    } else if (!this.isphoneNoNumberValid()) {
      this.setState({ error: 'Please enter valid phoneNo number.' });
      return false;
    } else if (!this.isPasswordValid()) {
      this.setState({ error: 'Password should atleast be 5 characters long.' });
      return false;
    } else if (!this.doesPasswordMatches()) {
      this.setState({ error: 'Password do not match.' });
      return false;
    } else {
      return true;
    }
  };

  formInputChangeHandler = (event) => {
    this.setState({ error: '' });
    const updatedUserInfo = { ...this.state.userInfo };
    updatedUserInfo[event.target.name] = event.target.value;
    this.setState({ userInfo: updatedUserInfo });
  };

  formSubmitHandler = async (event) => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ isLoading: true });
      try {
        const result = await fetcher(
          '/auth/signup',
          'POST',
          JSON.stringify(this.state.userInfo)
        );
        console.log(result);
        if (!result.success) {
          this.setState({ error: result.data[0].msg, isLoading: false });
        } else {
          this.setState({ isLoading: false });
          this.props.history.push('/login');
        }
      } catch (err) {
        this.setState({ isLoading: false });
        console.log('Error in signup frontend ', err);
        this.props.history.push('/error');
      }
    }
  };

  render() {
    let error = null;
    if (this.state.error !== '') {
      error = <p style={{ color: 'red' }}>{this.state.error}</p>;
    }
    return (
      <div className={classes.RootContainer}>
        <Form>
          <h1 style={{ marginBottom: '2rem' }}>SIGNUP</h1>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            name="name"
            type="text"
            placeholder="Your Name"
            value={this.state.userInfo.name}
            onChange={this.formInputChangeHandler}
          />

          <Form.Input
            fluid
            icon="mail"
            iconPosition="left"
            name="email"
            type="email"
            placeholder="Your E-mail"
            value={this.state.userInfo.email}
            onChange={this.formInputChangeHandler}
          />

          <Form.Input
            fluid
            icon="phone"
            iconPosition="left"
            name="phoneNo"
            type="text"
            placeholder="Your phoneNo number"
            value={this.state.userInfo.phoneNo}
            onChange={this.formInputChangeHandler}
          />

          <div
            style={{ textAlign: 'left' }}
            className={classes.RadioButtonsContainer}>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onClick={this.formInputChangeHandler}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onClick={this.formInputChangeHandler}
              />
              <label htmlFor="female">Female</label>
            </div>
            <div>
              <input
                type="radio"
                id="other"
                name="gender"
                value="other"
                onClick={this.formInputChangeHandler}
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>

          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            name="password"
            type="password"
            placeholder="Password"
            value={this.state.userInfo.password}
            onChange={this.formInputChangeHandler}
          />

          <Form.Input
            fluid
            icon="repeat"
            iconPosition="left"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={this.state.userInfo.confirmPassword}
            onChange={this.formInputChangeHandler}
          />

          <div
            style={{ textAlign: 'left' }}
            className={classes.RadioButtonsContainer}>
            <div>
              <input
                type="radio"
                id="admin"
                name="isAdmin"
                value={true}
                onClick={this.formInputChangeHandler}
              />
              <label htmlFor="admin">Admin</label>
            </div>
            <div>
              <input
                type="radio"
                id="user"
                name="isAdmin"
                value={false}
                onClick={this.formInputChangeHandler}
              />
              <label htmlFor="user">User</label>
            </div>
          </div>

          {error}

          <Button
            fluid
            color="green"
            loading={this.state.isLoading}
            style={{ margin: '2rem auto', backgroundColor: '#ef5350' }}
            onClick={this.formSubmitHandler}>
            Submit
          </Button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth
  };
};

export default connect(mapStateToProps)(Signup);
