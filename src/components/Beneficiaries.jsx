import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Beneficiary from './Beneficiary';

class Beneficiaries extends Component {

  render() {
    
    const { list } = this.props;
    
    return (
      <div className="orobo-beneficiaries">
        <h1 className="orobo-title">My Beneficiaries</h1> 

        {list.length > 0 && 
          list.map((item) => (
            <Beneficiary
              key={item.id}
              firstName={item.first_name}
              lastName={item.last_name}
              settlement={item.settlement_channel.title}
              flag={item.country_currency.flag}
              countryCode={item.country_currency.country_code} />
          ))
        }
    
        {list.length === 0 &&
          <div className="no-beneficiaries">No beneficiares added.</div>
        }
        
        
        <div className="add-new-beneficiary text-right">
          <Link to="/add-beneficiary">
            Add new beneficiary <i className="fa fa-plus" aria-hidden="true"/>
          </Link>
        </div>
      
      </div>
    );
  }

}

export default Beneficiaries;