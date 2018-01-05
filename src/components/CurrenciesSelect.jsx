import React, { Component } from 'react';

import Config from '../data/config';

class CurrenciesSelect extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e) {
    console.log('changed');
  }

  render() {
    
    const { list, selectedCountry } = this.props;
    
    return (
      <div className="currencies-select">
        <div className="form-group">
          <select name="currency_select" value={selectedCountry.id} onChange={this.handleChange} className="form-control">
            {list.map((item, index) => (
              <option key={index} value={item.id}>{item.country_name}</option>
            ))}
          </select>
        </div>
        
        {selectedCountry.flag && 
          <div className="selected-flag">
            <img src={Config.IMAGE_URL + selectedCountry.flag} alt={selectedCountry.country_name} />
          </div>
        }
      </div>
    );
  }

}

export default CurrenciesSelect;