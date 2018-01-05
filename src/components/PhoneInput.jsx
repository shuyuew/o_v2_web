import React, { Component } from 'react';
import axios from 'axios';

import OroboAPI from '../API/api-service';

class PhoneInput extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      country_currency: '',
      currencies: [],
      value: '',
      extension: '',
      errorVisible: false,
      errorMessage: 'Invalid Field'
    };
    
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.blurHandle = this.blurHandle.bind(this);
  }
  
  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onInputUpdate({
      name: event.target.name,
      value: event.target.value
    });
  }
  
  handleSelectChange(e) {
    const countrySelected = this.state.currencies.find((item) => item.id == e.target.value);
    this.setState({
      country_currency: e.target.value,
      extension: '+' + countrySelected.country_code
    });  
    this.props.updateCurrencyID({
      id: e.target.value,
      extension: '+' + countrySelected.country_code
    });
  }
  
  blurHandle(e) {
    // console.log(e);
  }
  
  componentDidMount() {
    this.props.onDropdownUpdate(true);
    
    OroboAPI.getSendingCurrencies().then((response) => {
      if (response.status === 200) {
        this.props.updateCurrencyID({
          id: response.data.PayLoad.data.currencies[0].id,
          extension: '+' + response.data.PayLoad.data.currencies[0].country_code
        });
        this.setState({
          country_currency: response.data.PayLoad.data.currencies[0].id,
          extension: '+' + response.data.PayLoad.data.currencies[0].country_code,
          currencies: response.data.PayLoad.data.currencies
        });
      }
      
      this.props.onDropdownUpdate(false);
    }, (error) => {
      this.props.onDropdownUpdate(false);
      console.log(error);
    });
    
  }

  render() {
    
    const { placeholder, name, label, updateInput, required } = this.props;
    const { country_currency, extension, currencies, value } = this.state;
    
    const currenciesList = currencies.map((currency) => {
      return (
        <option key={currency.id} value={currency.id}>{currency.iso_alpha3}</option>
      );
    });
    
    return (
      <div className="phone-group">
        
        <div className="phone-group__select">
          <select value={country_currency.id} onChange={this.handleSelectChange}>
            {currenciesList}
          </select>
        </div>
        
        <div className="phone-group__extension">
          <input
            className="form-control"
            type="text" 
            disabled 
            value={extension} 
            name="phone_extension" 
            placeholder="Code*" 
            aria-label="Code" />
        </div>
        
        <div className="phone-group__input">
          <input 
            className="form-control"
            type="number"
            required={required}
            value={value}
            placeholder={placeholder}
            aria-label={label}
            name={name}
            onBlur={this.blurHandle}
            onChange={this.handleChange}/>
        </div>
        
      </div>
    );
  }

}

export default PhoneInput;