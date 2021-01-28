import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BsSearch, BsCardList } from 'react-icons/bs';
import { BiPlus } from 'react-icons/bi';

import Bus from '../../components/Bus/Bus';
import SearchForm from '../SearchForm/SearchForm';
import AddBusForm from '../AddBusForm/AddBusForm';
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
    onAddBusSection: false,
    allBuses: [],
    previousPath: ''
  };

  componentDidMount() {
    this.fetchAllBuses();
    this.renderProperComponent();
  }

  renderProperComponent = () => {
    const path = this.props.location.pathname;
    if (path.includes('search')) this.searchSectionActiveHandler();
    else if (path.includes('add')) this.addBusSectionActiveHandler();
    else this.viewAllSectionActiveHandler();
    this.setState({ previousPath: path });
  };

  componentDidUpdate() {
    if (this.props.location.data && this.props.location.data.bus) {
      const bus = this.props.location.data.bus;
      this.props.location.data = null;
      const updatedAllBuses = [...this.state.allBuses];
      updatedAllBuses.push(bus);
      this.setState(
        {
          allBuses: updatedAllBuses
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

  fetchAllBuses = async () => {
    let path;
    if (this.props.userInfo && this.props.userInfo.isAdmin)
      path = '/admin/admin-buses?isAdmin=true';
    else path = '/bus/buses';
    const result = await fetcher(path, 'GET');
    console.log(result); //remove later
    if (!(result && result.success)) {
      console.log(result);
      return this.props.history.push('/error');
    }
    this.setState({ allBuses: result.buses });
  };

  searchSectionActiveHandler = () => {
    const [searchElement, viewElement, addElement] = getElements();
    searchElement.className = classes.ActiveDiv;
    viewElement.className = '';
    if (addElement) addElement.className = '';
    this.setState({
      onSearchSection: true,
      onViewAllSection: false,
      onAddBusSection: false
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
      onAddBusSection: false
    });
    this.props.history.push('/dashboard/view-all');
  };

  addBusSectionActiveHandler = () => {
    const [searchElement, viewElement, addElement] = getElements();
    searchElement.className = '';
    viewElement.className = '';
    addElement.className = classes.ActiveDiv;
    this.setState({
      onSearchSection: false,
      onViewAllSection: false,
      onAddBusSection: true
    });
    this.props.history.push('/dashboard/add');
  };

  redirectToBusDetails = (bus) => {
    this.props.history.push({
      pathname: '/bus-details/' + bus._id,
      data: bus
    });
  };

  render() {
    const searchSection = this.state.onSearchSection ? <SearchForm /> : null;

    const buses = this.state.allBuses.map((bus) => {
      return (
        <Bus
          key={bus._id}
          bus={bus}
          clicked={() => this.redirectToBusDetails(bus)}
          isAdmin={this.props.userInfo.isAdmin}
        />
      );
    });

    const viewAllSection = this.state.onViewAllSection ? buses : null;

    const addBusSection = this.state.onAddBusSection ? (
      <AddBusForm
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
            <div onClick={this.addBusSectionActiveHandler} id="add">
              <BiPlus size={24} />
              <h2>Add Bus</h2>
            </div>
          ) : null}
        </header>
        <main>
          {searchSection}
          {viewAllSection}
          {addBusSection}
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth,
    userInfo: state.auth.userDetails
  };
};

export default connect(mapStateToProps)(MainSection);
