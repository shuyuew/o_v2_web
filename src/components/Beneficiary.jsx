import React, { Component } from 'react';
import CONFIG from '../data/config.js';

class Beneficiary extends Component {

  render() {
    
    const {
      firstName,
      lastName,
      settlement,
      flag,
      countryCode
    } = this.props;
    
    return (
      <div className="beneficiary">
        
        <div className="beneficiary__user">
          <span>{firstName + ' ' + lastName}</span>
          <span>{settlement}</span>
        </div>
        
        <div className="beneficiary__country">
          <span className="text-right">
            <img src={CONFIG.IMAGE_URL + flag} alt={countryCode}/>
          </span>
          <span>Country code: {countryCode}</span>
        </div>
        
      </div>
    );
  }

}

export default Beneficiary;