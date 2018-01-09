import React, { Component } from 'react';
import CONFIG from '../data/config.js';

class Beneficiary extends Component {

  render() {
    
    const {
      info,
      selected,
      selectBeneficiary
    } = this.props;
    
    return (
      <div className={selected.id === info.id ? 'beneficiary selected' : 'beneficiary'} onClick={() => { selectBeneficiary(info); }}>
        
        <div className="beneficiary__user">
          <span>{info.first_name + ' ' + info.last_name}</span>
          <span>{info.settlement_channel.title}</span>
        </div>
        
        <div className="beneficiary__country">
          <span className="text-right">
            <img src={CONFIG.IMAGE_URL + info.country_currency.flag} alt={info.country_currency.currency_code}/>
          </span>
          <span>{info.country_currency.currency_code}</span>
        </div>
        
      </div>
    );
  }

}

export default Beneficiary;