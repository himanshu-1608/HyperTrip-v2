import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { BsCursor } from "react-icons/bs";
import { GoLocation } from "react-icons/go";
import { MdDateRange } from "react-icons/md";

import Bus from '../../components/Bus/Bus';
import fetcher from '../../fetchWrapper';
import classes from './SearchForm.module.css';

class SearchForm extends Component{

    state = {
        startCity: '',
        endCity: '',
        journeyDate: '',
        searchResults: [],
        errorMessage: '',
        isSearched: false
    }

    inputChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    isFromValid = () => {
        const { startCity, endCity, journeyDate } = this.state;
        return startCity.trim().length || endCity.trim().length || journeyDate.trim().length;
    }

    fromSubmitHandler = async() => {
        if(!this.isFromValid()){
            return;
        }
        const { startCity, endCity, journeyDate } = this.state;
        const body = JSON.stringify({
            startCity: startCity,
            endCity: endCity,
            journeyDate: journeyDate
        });
        const result = await fetcher('/bus/search-bus', 'POST', body);
        console.log(result);                                        // remove later
        if(!result.success){
            this.props.history.push('/error');
        }
        this.setState({searchResults: result.buses, isSearched: true});
    }

    redirectToBusDetails = (bus) => {
        this.props.history.push({
            pathname: '/bus-details/' + bus._id,
            data: bus
        })
    }

    render(){

        let searchResults = null;
        if(this.state.isSearched){
            const searchedBuses = this.state.searchResults.map(bus => {
                return <Bus 
                            key={bus._id} 
                            bus={bus} 
                            clicked={() => this.redirectToBusDetails(bus)}
                            isAdmin={this.props.userInfo.isAdmin}/>
            });

            searchResults = (
                <div className={classes.SearchResultsContainer}>
                    <header>
                        Search results
                        <hr />
                    </header>
                    <div>
                        {searchedBuses}
                    </div>
                </div>
            )
        }

        return(
            <div className={classes.RootContainer}>
                <div className={classes.FormContainer}>
                    <div className={classes.InputContainer}>
                        <BsCursor size={20}/>
                        <input 
                            type='text'
                            name='startCity'
                            placeholder='Start City'
                            value={this.state.startCity}
                            onChange={this.inputChangeHandler} />
                    </div>
                    <div className={classes.InputContainer}>
                        <GoLocation size={20}/>
                        <input 
                            type='text'
                            name='endCity'
                            placeholder='End City'
                            value={this.state.endCity}
                            onChange={this.inputChangeHandler} />
                    </div>
                    <div className={classes.InputContainer}>
                        <MdDateRange size={20} />
                        <input 
                            type='Date'
                            name='journeyDate'
                            placeholder='Date'
                            value={this.state.journeyDate}
                            onChange={this.inputChangeHandler}
                            style={{color:'grey', outline:'none'}} />
                    </div>
                    <button onClick={this.fromSubmitHandler}>Search</button>
                </div>
                {searchResults}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      userInfo: state.auth.userDetails
    }
  }

export default connect(mapStateToProps)(withRouter(SearchForm));